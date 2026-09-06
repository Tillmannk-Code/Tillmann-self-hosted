import 'server-only'

/**
 * Best-effort in-memory rate limiter. This is per-instance and resets on cold
 * start, which is fine as a first line of defence against a single abusive
 * client hammering the message endpoint. A durable cross-instance limiter
 * (e.g. Upstash) would be the upgrade path if abuse becomes a real problem.
 *
 * Kept in its own `server-only` module so the isomorphic validation helpers
 * and shared LIMITS in `limits.ts` can be imported by the client widget
 * without dragging server-only code into the browser bundle.
 */
const HITS = new Map<string, number[]>()

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): boolean {
  const now = Date.now()
  const cutoff = now - windowMs
  const recent = (HITS.get(key) ?? []).filter((t) => t > cutoff)

  if (recent.length >= limit) {
    HITS.set(key, recent)
    return false
  }

  recent.push(now)
  HITS.set(key, recent)

  // Opportunistic cleanup so the map can't grow without bound.
  if (HITS.size > 5000) {
    for (const [k, times] of HITS) {
      const live = times.filter((t) => t > cutoff)
      if (live.length === 0) HITS.delete(k)
      else HITS.set(k, live)
    }
  }

  return true
}
