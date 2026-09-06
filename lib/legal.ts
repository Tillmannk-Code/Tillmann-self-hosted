/**
 * Single source of truth for the legal entity behind the site.
 *
 * The Impressum, the privacy policy (both languages) and the JSON-LD all read
 * from here, so a change of address or VAT number can never leave one page
 * stating something different from another — which for an Impressum is not a
 * cosmetic problem but a compliance one.
 */

export const entity = {
  /** Sole proprietorship: the trading name is the person's name. */
  name: 'Tillmann Kühn',
  careOf: 'c/o WeWork',
  street: 'Warschauer Platz 11-13',
  postalCode: '10245',
  city: 'Berlin',
  country: 'Germany',
  countryDe: 'Deutschland',

  /** Umsatzsteuer-Identifikationsnummer, § 27 a UStG. */
  vatId: 'DE347048370',

  /** Kept as separate fields so inboxes can be split later if needed. */
  imprintEmail: 'hello@tillmann24.com',
  legalEmail: 'hello@tillmann24.com',
} as const

/** Formatted as a German postal address block. */
export const addressLines = [
  entity.name,
  entity.careOf,
  entity.street,
  `${entity.postalCode} ${entity.city}`,
] as const

/**
 * The two language variants of each legal document, used for the in-page
 * language toggle, the `hreflang` alternates and the sitemap.
 *
 * German is the authoritative version: the Impressum is a German statutory
 * duty (§ 5 DDG) and German authorities read the German text.
 */
export const legalRoutes = {
  imprint: { de: '/impressum', en: '/imprint' },
  privacy: { de: '/datenschutz', en: '/privacy' },
} as const

/** Date shown as "last updated" on the policy pages. */
export const legalLastUpdated = '2026-02-01'

export function formatLegalDate(iso: string, locale: 'de' | 'en') {
  return new Date(iso).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
