import { offerings, positioning, services, site } from '@/lib/content'
import type { PostMeta } from '@/lib/post-types'

/**
 * JSON-LD builders. Structured data is what lets search engines and AI
 * assistants state facts about Tillmann rather than infer them from prose —
 * every value here is drawn from lib/content.ts, never invented.
 */

const PERSON_ID = `${site.url}/#person`
const SITE_ID = `${site.url}/#website`

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: site.tagline,
    description: positioning.statement,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressCountry: 'DE',
    },
    sameAs: [site.linkedin],
    knowsLanguage: ['en', 'fr', 'de'],
    knowsAbout: [
      ...services.flatMap((s) => s.tags),
      'CRM strategy',
      'Lifecycle marketing',
      'Marketing analytics',
      'Growth strategy',
      'Interim management',
      'Fractional CMO',
    ],
  }
}

/**
 * The consultancy itself, kept separate from the Person so an assistant asked
 * "who offers CRM consulting in Berlin" can match the service catalogue.
 */
export function serviceSchema() {
  return {
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#service`,
    name: `${site.name} — ${site.tagline}`,
    url: site.url,
    email: `mailto:${site.email}`,
    founder: { '@id': PERSON_ID },
    provider: { '@id': PERSON_ID },
    areaServed: [
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Place', name: 'Europe' },
    ],
    knowsLanguage: ['en', 'fr', 'de'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Consulting engagements',
      itemListElement: offerings.map((o) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: o.title,
          description: o.body,
          ...(o.link ? { url: o.link.href } : {}),
        },
      })),
    },
  }
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  }
}

export function blogPostingSchema(post: PostMeta) {
  const url = `${site.url}/blog/${post.slug}`

  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: url,
    articleSection: post.topic,
    inLanguage: 'en',
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    isPartOf: { '@id': SITE_ID },
  }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  }
}

/** Wraps nodes in a single @graph so one script tag covers the whole page. */
export function graph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}
