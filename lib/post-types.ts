/**
 * Client-safe post types and helpers.
 *
 * Kept separate from `lib/posts.ts` because that module imports `node:fs`.
 * Client components must import from here, otherwise Turbopack tries to
 * bundle `fs` into the browser chunk and the build panics.
 */

export const TOPICS = ['CRM', 'Analytics', 'Marketing'] as const
export type Topic = (typeof TOPICS)[number]

export type PostMeta = {
  slug: string
  title: string
  date: string
  topic: Topic
  excerpt: string
  readTime: string
}

export type Post = PostMeta & { content: string }

export function formatDate(date: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
