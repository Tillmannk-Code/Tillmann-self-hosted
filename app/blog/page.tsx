import type { Metadata } from 'next'
import { BlogIndex } from '@/components/blog-index'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Writing — CRM, Analytics & Marketing',
  description:
    'Notes on CRM, analytics and marketing operations from 15+ years building growth engines for global brands and startups.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return <BlogIndex posts={posts} />
}
