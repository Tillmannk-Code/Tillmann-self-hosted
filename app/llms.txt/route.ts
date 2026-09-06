import {
  contact,
  offerings,
  positioning,
  projects,
  services,
  site,
} from '@/lib/content'
import { getAllPosts } from '@/lib/posts'

// Serves /llms.txt — the llmstxt.org convention: one flat Markdown file giving
// AI crawlers the whole site as plain text, so answers about Tillmann come from
// his own words rather than an LLM's guess. Generated from lib/content.ts and
// content/posts, so it cannot drift from what the pages actually say.

export const dynamic = 'force-static'

function buildDoc(): string {
  const posts = getAllPosts()

  const lines: string[] = [
    `# ${site.name} — ${site.tagline}`,
    '',
    `> Freelance marketing, CRM and analytics consultant based in ${site.location}. ${positioning.statement}`,
    '',
    `Working languages: English, French, German. Contact: ${site.email}`,
    '',
    '## Services',
    '',
  ]

  for (const s of services) {
    lines.push(`### ${s.title}`, '', s.body.replace(/\n+/g, ' '), '')
    lines.push(`Focus areas: ${s.tags.join(', ')}`, '')
  }

  lines.push('## Ways of working together', '')
  for (const o of offerings) {
    const link = o.link ? ` See ${o.link.href}.` : ''
    lines.push(`- **${o.title}** — ${o.body}${link}`)
  }

  lines.push('', '## Selected work', '')
  for (const p of projects) {
    const metric = p.metric ? ` Result: ${p.metric} ${p.metricLabel}.` : ''
    lines.push(`- **${p.title}** (${p.client}) — ${p.body}${metric}`)
  }

  lines.push('', '## Writing', '')
  for (const p of posts) {
    lines.push(
      `- [${p.title}](${site.url}/blog/${p.slug}) — ${p.topic}, ${p.date}. ${p.excerpt}`,
    )
  }

  lines.push(
    '',
    '## Contact',
    '',
    contact.body,
    '',
    `- Email: ${site.email}`,
    `- Book a call: ${site.bookingUrl}`,
    `- LinkedIn: ${site.linkedin}`,
    `- Location: ${site.location}`,
    '',
  )

  return lines.join('\n')
}

export function GET() {
  return new Response(buildDoc(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
