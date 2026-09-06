import 'server-only'
import { and, asc, eq, gt } from 'drizzle-orm'
import { db } from '@/lib/db'
import { conversations, messages, webhookDebug } from '@/lib/db/schema'
import type { Conversation, Message } from '@/lib/db/schema'

/**
 * TEMPORARY: record a webhook stage to the DB so we can trace the inbound flow
 * in production (console logs there aren't readable from v0). Never throws —
 * diagnostics must not break the request path. Remove with the debug table
 * once the reply round-trip is verified.
 */
export async function logWebhook(
  stage: string,
  detail?: unknown,
): Promise<void> {
  try {
    await db.insert(webhookDebug).values({
      stage,
      detail: (detail ?? null) as Record<string, unknown> | null,
    })
  } catch {
    // swallow — diagnostics are best-effort
  }
}

/**
 * Data-access layer for the chat feature. Conversations are addressed by an
 * unguessable token (there are no accounts), so every visitor-facing read is
 * scoped by that token — the equivalent of per-user scoping in an authed app.
 */

/** Public shape sent to the browser. Never leaks the Chat thread name. */
export type PublicMessage = {
  id: string
  sender: 'visitor' | 'owner'
  body: string
  createdAt: string
}

function toPublic(m: Message): PublicMessage {
  return {
    id: m.id,
    sender: m.sender,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
  }
}

export async function createConversation(input: {
  token: string
  visitorEmail: string
  visitorName: string | null
}): Promise<Conversation> {
  const [row] = await db
    .insert(conversations)
    .values({
      token: input.token,
      visitorEmail: input.visitorEmail,
      visitorName: input.visitorName,
    })
    .returning()
  return row
}

export async function getConversationByToken(
  token: string,
): Promise<Conversation | null> {
  const [row] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.token, token))
    .limit(1)
  return row ?? null
}

/** Used by the inbound webhook to route an owner reply back to a conversation. */
export async function getConversationByThread(
  threadName: string,
): Promise<Conversation | null> {
  const [row] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.chatThreadName, threadName))
    .limit(1)
  return row ?? null
}

export async function setConversationThread(
  conversationId: string,
  threadName: string,
): Promise<void> {
  await db
    .update(conversations)
    .set({ chatThreadName: threadName })
    .where(eq(conversations.id, conversationId))
}

export async function addMessage(input: {
  conversationId: string
  sender: 'visitor' | 'owner'
  body: string
}): Promise<PublicMessage> {
  const [row] = await db
    .insert(messages)
    .values({
      conversationId: input.conversationId,
      sender: input.sender,
      body: input.body,
    })
    .returning()

  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, input.conversationId))

  return toPublic(row)
}

/**
 * Messages for a conversation, optionally only those newer than `after`
 * (an ISO timestamp). The poll route uses `after` so each poll returns only
 * what the widget has not seen.
 */
export async function getMessages(
  conversationId: string,
  after?: string | null,
): Promise<PublicMessage[]> {
  const conditions = [eq(messages.conversationId, conversationId)]
  if (after) {
    const parsed = new Date(after)
    if (!Number.isNaN(parsed.getTime())) {
      conditions.push(gt(messages.createdAt, parsed))
    }
  }

  const rows = await db
    .select()
    .from(messages)
    .where(and(...conditions))
    .orderBy(asc(messages.createdAt))

  return rows.map(toPublic)
}
