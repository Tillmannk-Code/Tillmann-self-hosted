import Link from 'next/link'
import { formatDate, type PostMeta } from '@/lib/post-types'
import { cn } from '@/lib/utils'

/**
 * Row-style post link. Hairline-separated list rather than floating cards,
 * to match the technical grid language of the rest of the site.
 */
export function PostCard({
  post,
  className,
}: {
  post: PostMeta
  className?: string
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group rule-t flex flex-col gap-4 py-8 transition-colors duration-200 hover:border-accent md:flex-row md:items-baseline md:gap-10',
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-4 md:w-56 md:flex-col md:items-start md:gap-2">
        <span className="eyebrow text-accent">{post.topic}</span>
        <span className="eyebrow text-muted-foreground/70">
          {formatDate(post.date)}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-balance transition-colors duration-200 group-hover:text-accent md:text-3xl">
          {post.title}
        </h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground text-pretty">
          {post.excerpt}
        </p>
        <span className="eyebrow mt-4 inline-block text-muted-foreground/60">
          {post.readTime}
        </span>
      </div>

      <span
        aria-hidden
        className="text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:self-center"
      >
        →
      </span>
    </Link>
  )
}
