import { NextResponse } from 'next/server'
import { getChatConfig, verifyChatRequest } from '@/lib/chat/google-chat'
import {
  addMessage,
  getConversationByThread,
  logWebhook,
} from '@/lib/chat/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Inbound endpoint for the Google Chat app. Google delivers an event here
 * whenever the owner @mentions the bot in a thread. We verify the request is
 * genuinely from Google, match the thread to a conversation, and store the
 * owner's reply so the visitor's widget picks it up on its next poll.
 *
 * Google requires a 200 response; returning an error status makes Chat retry
 * and eventually mark the app unhealthy. So all handled outcomes return 200 —
 * only a failed signature check returns 401.
 */
export async function POST(req: Request) {
  // TEMP diagnostics: read the raw body first so we can record the full event
  // even if a later step bails, and prove the endpoint is being hit at all.
  const rawBody = await req.text()
  const authHeader = req.headers.get('authorization')
  const fwdHost = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  const fwdProto = req.headers.get('x-forwarded-proto') ?? 'https'

  await logWebhook('hit', {
    hasAuthHeader: Boolean(authHeader),
    authScheme: authHeader?.split(' ')[0] ?? null,
    host: fwdHost,
    bodyPreview: rawBody.slice(0, 2000),
  })

  const config = getChatConfig()
  if (!config) {
    await logWebhook('no-config')
    return NextResponse.json({})
  }

  // Candidate endpoint URLs Google may use as the token audience in "App URL"
  // mode. Behind Vercel's proxy the public host is in x-forwarded-*.
  const audienceUrls = [
    fwdHost ? `${fwdProto}://${fwdHost}/api/chat/webhook` : null,
    'https://tillmann24.com/api/chat/webhook',
  ].filter((u): u is string => Boolean(u))

  const payload = await verifyChatRequest(authHeader, config, audienceUrls)
  if (!payload) {
    await logWebhook('verify-failed', { audienceUrls })
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
  await logWebhook('verified')

  let event: ChatEvent
  try {
    event = JSON.parse(rawBody) as ChatEvent
  } catch {
    await logWebhook('body-not-json')
    return NextResponse.json({})
  }

  // Normalize both envelopes: the add-on puts the message under
  // chat.messagePayload.message and the sender under chat.user; the classic
  // shape uses event.message and message.sender.
  const message =
    event.chat?.messagePayload?.message ??
    event.chat?.appCommandPayload?.message ??
    event.message
  const senderType = event.chat?.user?.type ?? message?.sender?.type

  await logWebhook('event', {
    hasChat: Boolean(event.chat),
    senderType,
    thread: message?.thread?.name,
    hasArgumentText: Boolean(message?.argumentText),
  })

  // Only human-authored messages carry a reply. Ignore other event types
  // (added-to-space, etc.) and never echo the bot's own posts back in.
  if (!message || senderType !== 'HUMAN') {
    await logWebhook('skipped-non-message', { senderType })
    return NextResponse.json({})
  }

  const threadName = message.thread?.name
  // `argumentText` is the message with the bot mention already stripped by
  // Google; fall back to `text` if it's absent.
  const body = (message.argumentText ?? message.text ?? '').trim()

  if (!threadName || !body) {
    await logWebhook('missing-thread-or-body', {
      threadName,
      hasBody: Boolean(body),
    })
    return NextResponse.json({})
  }

  const conversation = await getConversationByThread(threadName)
  if (!conversation) {
    await logWebhook('no-conversation', { threadName })
    return NextResponse.json(
      chatReply(
        'This thread is not linked to a website conversation. To reply to a visitor, open their "New chat from…" message and reply INSIDE that thread (with an @mention of the app) — a new top-level message starts an unlinked thread.',
      ),
    )
  }

  await addMessage({
    conversationId: conversation.id,
    sender: 'owner',
    body,
  })
  await logWebhook('stored', { conversationId: conversation.id })

  // A quiet confirmation back in the Chat thread so the owner knows it landed.
  return NextResponse.json(chatReply('Sent to the visitor.'))
}

/**
 * A Workspace add-on must respond with a DataActions object; returning the
 * classic `{ text }` shape is treated as an invalid payload. This wraps a
 * plain string into the required createMessageAction envelope.
 */
function chatReply(text: string) {
  return {
    hostAppDataAction: {
      chatDataAction: {
        createMessageAction: { message: { text } },
      },
    },
  }
}

type ChatMessage = {
  text?: string
  argumentText?: string
  thread?: { name?: string }
  sender?: { type?: string; displayName?: string }
}

/**
 * Two request shapes are possible:
 *  - Classic Chat app: `{ type: 'MESSAGE', message: {...} }`
 *  - Workspace add-on: `{ chat: { user, messagePayload: { message: {...} } } }`
 *    (no top-level `type`; the sender is `chat.user`, not `message.sender`).
 * This app is an add-on, but we keep the classic fields for forward-safety.
 */
type ChatEvent = {
  type?: string
  message?: ChatMessage
  chat?: {
    user?: { type?: string; displayName?: string }
    messagePayload?: { message?: ChatMessage }
    // Slash-command interactions arrive under appCommandPayload instead.
    appCommandPayload?: { message?: ChatMessage }
  }
}
