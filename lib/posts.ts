import 'server-only'

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Post, PostMeta, Topic } from '@/lib/post-types'

export { formatDate, TOPICS } from '@/lib/post-types'
export type { Post, PostMeta, Topic } from '@/lib/post-types'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

function readTimeFor(content: string): string {
  const words = content.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 220))} min read`
}

function parseFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ''),
    topic: (data.topic ?? 'Marketing') as Topic,
    excerpt: String(data.excerpt ?? ''),
    readTime: readTimeFor(content),
    content,
  }
}

function allPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parseFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getAllPosts(): PostMeta[] {
  return allPosts().map(({ content: _content, ...meta }) => meta)
}

export function getPostSlugs(): string[] {
  return allPosts().map((p) => p.slug)
}

export function getPost(slug: string): Post | undefined {
  return allPosts().find((p) => p.slug === slug)
}

/** Previous / next in reverse-chronological order, for post footer nav. */
export function getPostNeighbours(slug: string): {
  previous?: PostMeta
  next?: PostMeta
} {
  const posts = getAllPosts()
  const i = posts.findIndex((p) => p.slug === slug)
  if (i === -1) return {}

  return {
    previous: posts[i + 1],
    next: posts[i - 1],
  }
}
