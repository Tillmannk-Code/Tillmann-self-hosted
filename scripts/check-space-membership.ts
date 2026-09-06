/**
 * One-off diagnostic: list the memberships of the configured Chat space so we
 * can see whether the WebLiveChatT24 app is actually present as a member (and
 * how). Run with: pnpm exec tsx scripts/check-space-membership.ts
 *
 * Safe/read-only. Delete once the inbound reply flow is verified.
 */
import { GoogleAuth } from 'google-auth-library'

const CHAT_API = 'https://chat.googleapis.com/v1'

function normalizeSpace(raw: string): string {
  const cleaned = raw.trim().split(/[?#]/)[0].replace(/\/+$/, '')
  const id = cleaned.split('/').pop() ?? cleaned
  return `spaces/${id}`
}

// Reuse the same tolerant key parsing as the app.
function decodeAnsiC(body: string): string {
  let out = ''
  for (let i = 0; i < body.length; i++) {
    if (body[i] !== '\\' || i === body.length - 1) {
      out += body[i]
      continue
    }
    const next = body[++i]
    if (next === 'n') out += '\n'
    else if (next === 't') out += '\t'
    else if (next === 'r') out += '\r'
    else out += next
  }
  return out
}
function normalizeKey(raw: string): string {
  const t = raw.trim()
  if (t.startsWith("$'") && t.endsWith("'")) return decodeAnsiC(t.slice(2, -1))
  if (t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1)
  return t
}

async function main() {
  const key = process.env.GOOGLE_CHAT_SERVICE_ACCOUNT_KEY
  const space = normalizeSpace(process.env.GOOGLE_CHAT_SPACE ?? '')
  if (!key || !space) throw new Error('Missing GOOGLE_CHAT_* env vars')

  const auth = new GoogleAuth({
    credentials: JSON.parse(normalizeKey(key)),
    scopes: ['https://www.googleapis.com/auth/chat.bot'],
  })
  const client = await auth.getClient()
  const { token } = await client.getAccessToken()
  const headers = { Authorization: `Bearer ${token}` }

  console.log('[v0] space:', space)

  const sres = await fetch(`${CHAT_API}/${space}`, { headers })
  console.log('[v0] space.get status:', sres.status)
  console.log('[v0] space.get body:', await sres.text())

  const mres = await fetch(`${CHAT_API}/${space}/members?pageSize=50`, { headers })
  console.log('[v0] members.list (humans) status:', mres.status)
  console.log('[v0] members.list (humans) body:', await mres.text())

  // members.list excludes apps by default; filter explicitly for BOT members.
  const bres = await fetch(
    `${CHAT_API}/${space}/members?pageSize=50&filter=${encodeURIComponent('member.type = "BOT"')}`,
    { headers },
  )
  console.log('[v0] members.list (bots) status:', bres.status)
  console.log('[v0] members.list (bots) body:', await bres.text())

  // List recent messages with their thread + sender so we can see whether the
  // app's post and the owner's reply share a thread.
  const msgres = await fetch(
    `${CHAT_API}/${space}/messages?pageSize=20&orderBy=${encodeURIComponent('createTime desc')}`,
    { headers },
  )
  console.log('[v0] messages.list status:', msgres.status)
  const mjson = (await msgres.json()) as {
    messages?: Array<{
      name?: string
      text?: string
      thread?: { name?: string }
      sender?: { name?: string; type?: string; displayName?: string }
      createTime?: string
    }>
  }
  for (const m of mjson.messages ?? []) {
    console.log('[v0] msg:', {
      thread: m.thread?.name,
      senderType: m.sender?.type,
      sender: m.sender?.displayName ?? m.sender?.name,
      text: (m.text ?? '').slice(0, 40),
      at: m.createTime,
    })
  }
}

main().catch((e) => {
  console.error('[v0] error:', e)
  process.exit(1)
})
