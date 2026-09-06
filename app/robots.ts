import type { MetadataRoute } from 'next'
import { site } from '@/lib/content'

// Serves /robots.txt

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Everything is public, so a single permissive rule covers every crawler
      // — including AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
      // Blocking those would remove the site from AI answers, which is the
      // opposite of the goal here.
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
