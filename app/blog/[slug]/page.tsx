import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Container } from '@/components/container'
import { Cta } from '@/components/cta'
import { JsonLd } from '@/components/json-ld'
import { mdxComponents } from '@/components/mdx-components'
import { blogPostingSchema, breadcrumbSchema, graph } from '@/lib/schema'
import { formatDate, getPost, getPostNeighbours, getPostSlugs } from '@/lib/posts'
import { site } from '@/lib/content'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
      authors: [site.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) notFound()

  const { previous, next } = getPostNeighbours(slug)

  return (
    <article className="pt-32 pb-20 md:pt-40 md:pb-28">
      <JsonLd
        data={graph(
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        )}
      />
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="eyebrow text-muted-foreground transition-colors hover:text-accent"
        >
          ← All writing
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="eyebrow text-accent">{post.topic}</span>
          <span aria-hidden className="text-muted-foreground/40">
            /
          </span>
          <span className="eyebrow text-muted-foreground">
            {formatDate(post.date)}
          </span>
          <span aria-hidden className="text-muted-foreground/40">
            /
          </span>
          <span className="eyebrow text-muted-foreground">
            {post.readTime}
          </span>
        </div>

        <h1 className="display mt-6 text-4xl text-balance md:text-6xl">
          {post.title}
        </h1>

        <p className="rule-b mt-8 pb-10 text-xl leading-relaxed text-muted-foreground text-pretty">
          {post.excerpt}
        </p>

        <div className="mt-12">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* CTA */}
        <div className="rule-t mt-20 pt-10">
          <p className="display text-2xl text-balance md:text-3xl">
            Got a version of this problem?
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            I work with teams on exactly this — CRM, analytics and marketing
            operations that need to start producing results.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Cta href={site.bookingUrl}>Book a call</Cta>
            <Cta href={`mailto:${site.email}`} variant="outline">
              Send an email
            </Cta>
          </div>
        </div>

        {/* Prev / next */}
        {(previous || next) && (
          <nav className="rule-t mt-16 grid gap-8 pt-10 sm:grid-cols-2">
            {next ? (
              <Link href={`/blog/${next.slug}`} className="group">
                <span className="eyebrow text-muted-foreground/60">
                  Newer
                </span>
                <p className="mt-2 font-semibold leading-tight text-pretty transition-colors group-hover:text-accent">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span />
            )}

            {previous && (
              <Link
                href={`/blog/${previous.slug}`}
                className="group sm:text-right"
              >
                <span className="eyebrow text-muted-foreground/60">
                  Older
                </span>
                <p className="mt-2 font-semibold leading-tight text-pretty transition-colors group-hover:text-accent">
                  {previous.title}
                </p>
              </Link>
            )}
          </nav>
        )}
      </Container>
    </article>
  )
}
