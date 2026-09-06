/**
 * Shared constants for analytics consent.
 *
 * Legal background, because it dictates the design: § 25 TDDDG (the German
 * implementation of the ePrivacy directive) requires opt-in *before* storing
 * anything on a visitor's device that is not strictly necessary. Google
 * Analytics stores `_ga` cookies, so the tag may not load until the visitor
 * has actively agreed — a banner that only informs, or one that treats
 * "no answer" as a yes, would not be lawful.
 */

export const CONSENT_STORAGE_KEY = 'tk-analytics-consent'

/** Fired to re-open the banner so consent can be withdrawn or changed. */
export const CONSENT_REOPEN_EVENT = 'tk:consent-reopen'

export type ConsentState = 'granted' | 'denied'

/**
 * `null` means "has not decided yet" — deliberately distinct from `denied`,
 * because only the undecided state should surface the banner.
 */
export type StoredConsent = ConsentState | null

export function readStoredConsent(): StoredConsent {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    // Private browsing modes can throw on localStorage access. Treating that
    // as "undecided" is the safe default: it keeps analytics off.
    return null
  }
}

export function writeStoredConsent(value: ConsentState) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
  } catch {
    // Non-fatal: consent simply won't persist across reloads, which errs
    // towards not tracking.
  }
}

/**
 * Removes the cookies Google Analytics has already written.
 *
 * Withdrawing consent has to actually take effect, not just stop future
 * collection — otherwise identifiers set under the previous grant keep
 * sitting on the device.
 */
export function clearAnalyticsCookies() {
  if (typeof document === 'undefined') return

  const hostname = window.location.hostname
  // Also try the registrable domain, since GA sets cookies on `.example.com`.
  const domains = [hostname, `.${hostname}`]
  const parts = hostname.split('.')
  if (parts.length > 2) {
    const root = parts.slice(-2).join('.')
    domains.push(root, `.${root}`)
  }

  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim()
    if (!name) continue
    if (!/^(_ga|_gid|_gat|_gac)/.test(name)) continue

    for (const domain of domains) {
      document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}
