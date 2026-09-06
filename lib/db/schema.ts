import { sql } from 'drizzle-orm'
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

/**
 * One row per visitor conversation. Visitors are anonymous — there are no
 * accounts. Instead each conversation gets an unguessable `token` that lives
 * in the visitor's localStorage and scopes every read/write to their own
 * thread. `chat_thread_name` is the Google Chat thread this conversation is
 * mirrored into, and is how an inbound owner reply finds its way back here.
 */
export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    token: text('token').notNull().unique(),
    visitorEmail: text('visitor_email').notNull(),
    visitorName: text('visitor_name'),
    chatThreadName: text('chat_thread_name'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('conversations_chat_thread_idx').on(table.chatThreadName)],
)

/**
 * Every message in a conversation. `sender` is either the anonymous visitor
 * or the site owner (a reply that came back from Google Chat).
 */
export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id').notNull(),
    sender: text('sender', { enum: ['visitor', 'owner'] }).notNull(),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('messages_conversation_created_idx').on(
      table.conversationId,
      table.createdAt,
    ),
  ],
)

/**
 * TEMPORARY diagnostic table. The inbound Google Chat webhook only runs on the
 * deployed site (Google can't reach preview/localhost) and production console
 * logs aren't readable from here, so the webhook records each stage as a row we
 * can query via the Neon MCP. Remove this table and its writes once the owner
 * reply → widget round-trip is confirmed working.
 */
export const webhookDebug = pgTable('webhook_debug', {
  id: uuid('id').primaryKey().defaultRandom(),
  stage: text('stage').notNull(),
  detail: jsonb('detail'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type Conversation = typeof conversations.$inferSelect
export type Message = typeof messages.$inferSelect

// Re-exported so callers can build parameterized raw fragments if ever needed
// without importing drizzle-orm directly.
export { sql }
