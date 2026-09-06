/**
 * Browser-side helpers for the chat widget: localStorage persistence and thin
 * fetch wrappers. Kept out of the component so the component stays about UI.
 */

export type PublicMessage = {
  id: string
  sender: 'visitor' | 'owner'
  body: string
  createdAt: string
}

const TOKEN_KEY = 'tk-chat-token'
const IDENTITY_KEY = 'tk-chat-identity'

export type Identity = { email: string; name: string | null }

export function readToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function writeToken(token: string): void {
  try {
    window.localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* private mode / storage disabled — chat still works for this session */
  }
}

export function readIdentity(): Identity | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(IDENTITY_KEY)
    return raw ? (JSON.parse(raw) as Identity) : null
  } catch {
    return null
  }
}

export function writeIdentity(identity: Identity): void {
  try {
    window.localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity))
  } catch {
    /* ignore */
  }
}

export type SendResult =
  | { ok: true; token: string; message: PublicMessage }
  | { ok: false; error: string; notConfigured?: boolean }

export async function sendMessage(input: {
  token: string | null
  email?: string
  name?: string
  message: string
}): Promise<SendResult> {
  let res: Response
  try {
    res = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }

  if (res.status === 503) {
    return {
      ok: false,
      notConfigured: true,
      error: 'Live chat is not available right now.',
    }
  }

  let data: Record<string, unknown> = {}
  try {
    data = await res.json()
  } catch {
    /* fall through to status-based error */
  }

  if (!res.ok) {
    return {
      ok: false,
      error:
        (typeof data.error === 'string' && data.error) ||
        'Something went wrong. Please try again.',
    }
  }

  return {
    ok: true,
    token: data.token as string,
    message: data.message as PublicMessage,
  }
}

export async function pollMessages(
  token: string,
  after: string | null,
): Promise<PublicMessage[]> {
  const url = new URL('/api/chat/poll', window.location.origin)
  url.searchParams.set('token', token)
  if (after) url.searchParams.set('after', after)

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const data = (await res.json()) as { messages?: PublicMessage[] }
    return data.messages ?? []
  } catch {
    return []
  }
}
