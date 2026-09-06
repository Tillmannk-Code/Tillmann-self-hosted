import { NextResponse } from 'next/server'
import { getConversationByToken, getMessages } from '@/lib/chat/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Returns messages newer than `after` for the conversation identified by
 * `token`. The token is the only credential — an unguessable value stored in
 * the visitor's browser — so a caller can only ever read their own thread.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const after = url.searchParams.get('after')

  if (!token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 })
  }

  const conversation = await getConversationByToken(token)
  if (!conversation) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  const messages = await getMessages(conversation.id, after)

  return NextResponse.json(
    { messages },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
