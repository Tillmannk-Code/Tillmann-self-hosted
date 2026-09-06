import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

/**
 * Explicit element mapping rather than a prose plugin — keeps article
 * typography on the same tokens and mono/display language as the site.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="rule-t mt-16 pt-8 text-2xl font-semibold leading-tight tracking-tight text-balance md:text-3xl">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mt-12 text-lg font-semibold leading-snug tracking-tight text-balance md:text-xl">
      {children}
    </h3>
  ),

  p: ({ children }) => (
    <p className="mt-6 leading-relaxed text-muted-foreground text-pretty">
      {children}
    </p>
  ),

  ul: ({ children }) => (
    <ul className="mt-6 flex flex-col gap-3">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="mt-6 flex list-decimal flex-col gap-3 pl-5">{children}</ol>
  ),

  li: ({ children }) => (
    <li className="leading-relaxed text-muted-foreground text-pretty marker:text-accent">
      {children}
    </li>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),

  em: ({ children }) => <em className="italic">{children}</em>,

  blockquote: ({ children }) => (
    <blockquote className="mt-8 border-l-2 border-accent pl-6 text-lg leading-relaxed text-foreground text-pretty">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="rule-t mt-12 border-0" />,

  a: ({ href, children }) => {
    const url = String(href ?? '')
    const isExternal = url.startsWith('http')

    if (isExternal) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
        >
          {children}
        </a>
      )
    }

    return (
      <Link
        href={url}
        className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {children}
      </Link>
    )
  },

  code: ({ children }) => (
    <code className="rounded-sm bg-card px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
      {children}
    </code>
  ),

  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-sm border border-border bg-card p-5 font-mono text-sm leading-relaxed">
      {children}
    </pre>
  ),
}
