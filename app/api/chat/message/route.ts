import { NextResponse } from 'next/server'
import {
  getChatConfig,
  postVisitorMessage,
} from '@/lib/chat/google-chat'
import { cleanText, isValidEmail, LIMITS } from '@/lib/chat/limits'
import { rateLimit } from '@/lib/chat/rate-limit'
import {
  addMessage,
  createConversation,
  getConversationByToken,
  setConversationThread,
} from '@/lib/chat/service'

export const runtime = 'nodejs'

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  return fwd?.split(',')[0]?.trim() || 'unknown'
}

function newToken(): string {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().slice(0, 8)
}

export async function POST(req: Request) {
  // Two gates: a burst limit per IP, plus a slower sustained limit, so a
  // single client can't flood the space regardless of conversation churn.
  const ip = clientIp(req)
  if (
    !rateLimit(`msg:burst:${ip}`, { limit: 5, windowMs: 10_000 }) ||
    !rateLimit(`msg:sustained:${ip}`, { limit: 40, windowMs: 60 * 60_000 })
  ) {
    return NextResponse.json(
      { error: 'Too many messages. Please slow down.' },
      { status: 429 },
    )
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const data = payload as Record<string, unknown>
  const message = cleanText(data.message, LIMITS.message)
  if (!message) {
    return NextResponse.json(
      { error: 'Message is required.' },
      { status: 400 },
    )
  }

  const config = getChatConfig()
  if (!config) {
    // Setup not finished. Tell the widget cleanly rather than 500-ing.
    return NextResponse.json(
      { error: 'not_configured' },
      { status: 503 },
    )
  }

  const rawToken = typeof data.token === 'string' ? data.token : null
  let conversation = rawToken ? await getConversationByToken(rawToken) : null
  let isFirstMessage = false

  if (!conversation) {
    // Starting a new conversation: email is mandatory so replies can reach the
    // visitor even if they never come back to the widget.
    const email = data.email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'A valid email is required to start the chat.' },
        { status: 400 },
      )
    }
    const name = cleanText(data.name, LIMITS.name)
    conversation = await createConversation({
      token: newToken(),
      visitorEmail: email,
      visitorName: name,
    })
    isFirstMessage = true
  }

  // Persist first so a Chat outage never loses the visitor's message.
  const stored = await addMessage({
    conversationId: conversation.id,
    sender: 'visitor',
    body: message,
  })

  // Mirror into Google Chat. On the first message we prefix the visitor's
  // identity; afterwards the thread already carries that context.
  const chatText = isFirstMessage
    ? `New chat from ${conversation.visitorName ?? 'a visitor'} (${conversation.visitorEmail}):\n\n${message}\n\n_Reply inside this thread and @mention the app to answer the visitor._`
    : message

  try {
    const posted = await postVisitorMessage(config, {
      text: chatText,
      threadName: conversation.chatThreadName,
    })
    if (posted.threadName && !conversation.chatThreadName) {
      await setConversationThread(conversation.id, posted.threadName)
    }
  } catch (err) {
    // The message is already saved and visible to the visitor; a failed mirror
    // shouldn't 500 the request. Log for the owner to investigate.
    console.error('[v0] Google Chat mirror failed:', err)
  }

  return NextResponse.json({ token: conversation.token, message: stored })
}
