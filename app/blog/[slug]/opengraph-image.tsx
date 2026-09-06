import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgCard,
  displaySize,
  loadOgFonts,
} from '@/lib/og'
import { site } from '@/lib/content'
import { getPost, getPostSlugs } from '@/lib/posts'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Without this the route opts into dynamic rendering and the card would be
// generated per request instead of once at build time.
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

/**
 * Deliberately a static string rather than a per-post one via
 * generateImageMetadata: that helper introduces a [__metadata_id__] dynamic
 * segment, which drops these cards out of build-time prerendering and makes a
 * share-preview crawler wait on a cold render. The card's own headline is
 * legible in the image, so a generic alt is a cheap trade for a baked PNG.
 */
export const alt = `Article by ${site.name} — ${site.tagline}`

export default async function PostOgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return new ImageResponse(
    (
      <OgCard
        eyebrowLeft={`${post.topic} · ${post.readTime}`}
        eyebrowRight="tillmann24.com"
        footer={site.role}
      >
        <div
          style={{
            fontSize: displaySize(post.title),
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            // Satori has no line clamping, so displaySize() scales the type to
            // the headline length to keep it inside the card.
            textWrap: 'balance',
          }}
        >
          {post.title}
        </div>
      </OgCard>
    ),
    { ...size, fonts: await loadOgFonts() },
  )
}
