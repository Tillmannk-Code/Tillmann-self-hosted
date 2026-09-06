import type { MetadataRoute } from 'next'
import { site } from '@/lib/content'
import { legalRoutes } from '@/lib/legal'
import { getAllPosts } from '@/lib/posts'

// Serves /sitemap.xml. Post entries are derived from content/posts, so adding
// an .mdx file puts it in the sitemap with no further edits.

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  // Freshest post date doubles as the "last modified" signal for the two
  // listing pages, since both are rebuilt whenever a post is added.
  const latest = posts[0]?.date
    ? new Date(posts[0].date)
    : new Date()

  return [
    {
      url: site.url,
      lastModified: latest,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${site.url}/blog`,
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    // Legal pages: indexable so they can be found, but low priority — they
    // should never compete with the actual content for crawl budget. Each
    // document declares its own hreflang pair via `alternates` in its metadata.
    ...Object.values(legalRoutes).flatMap((pair) =>
      Object.values(pair).map((path) => ({
        url: `${site.url}${path}`,
        changeFrequency: 'yearly' as const,
        priority: 0.1,
      })),
    ),
  ]
}
