/**
 * Isomorphic field limits and validators, shared by the client widget and the
 * server routes. Deliberately free of any `server-only` import or server-only
 * dependency so the client bundle can import `LIMITS` safely. The server-only
 * rate limiter lives in `./rate-limit`.
 */

/** Field limits, shared between the client widget and server validation. */
export const LIMITS = {
  email: 254,
  name: 80,
  message: 2000,
} as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= LIMITS.email &&
    EMAIL_RE.test(value)
  )
}

export function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > max) return null
  return trimmed
}
