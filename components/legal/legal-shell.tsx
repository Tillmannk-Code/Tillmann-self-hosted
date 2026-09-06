import Link from 'next/link'
import { Container } from '@/components/container'

/**
 * Shared chrome for the four legal documents.
 *
 * Legal copy is the one place on this site where readability beats visual
 * ambition: a single measured column, generous leading and real heading
 * hierarchy, so someone can actually find the clause they came for. The
 * brutalist hairline rules and mono eyebrows keep it recognisably the same
 * site without making the text harder to scan.
 */
export function LegalShell({
  eyebrow,
  title,
  intro,
  lastUpdated,
  altHref,
  altLabel,
  children,
}: {
  eyebrow: string
  title: string
  intro?: string
  lastUpdated?: string
  /** The same document in the other language. */
  altHref: string
  altLabel: string
  children: React.ReactNode
}) {
  return (
    <article className="pb-24 md:pb-32">
      <header className="rule-b">
        <Container className="flex flex-col gap-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow text-accent">{eyebrow}</p>
            {/*
              A plain link rather than a locale router: there are exactly two
              documents in two languages, so routing machinery would be more
              moving parts than the problem deserves.
            */}
            <Link
              href={altHref}
              hrefLang={altLabel === 'Deutsch' ? 'de' : 'en'}
              className="eyebrow border-border hover:border-accent hover:text-accent text-muted-foreground border px-3 py-2 transition-colors"
            >
              {altLabel}
            </Link>
          </div>

          <h1 className="display text-[clamp(2.25rem,7vw,4.5rem)] text-balance">
            {title}
          </h1>

          {intro ? (
            <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
              {intro}
            </p>
          ) : null}

          {lastUpdated ? (
            <p className="eyebrow text-muted-foreground/60">{lastUpdated}</p>
          ) : null}
        </Container>
      </header>

      <Container className="pt-12 md:pt-16">
        <div className="flex max-w-3xl flex-col gap-12">{children}</div>
      </Container>
    </article>
  )
}

/** One numbered top-level section of a legal document. */
export function LegalSection({
  id,
  heading,
  children,
}: {
  id?: string
  heading: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight md:text-2xl">
        {heading}
      </h2>
      <div className="text-muted-foreground flex flex-col gap-4 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

/** Sub-heading inside a section, for individual services or data categories. */
export function LegalSubheading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-foreground pt-2 font-bold tracking-tight">
      {children}
    </h3>
  )
}

/**
 * Key/value rows — the Impressum is mostly labelled facts, and a definition
 * list says that to a screen reader far better than a stack of paragraphs.
 */
export function LegalFacts({
  items,
}: {
  items: { term: string; value: React.ReactNode }[]
}) {
  return (
    <dl className="divide-border border-border divide-y border-y">
      {items.map((item) => (
        <div
          key={item.term}
          className="flex flex-col gap-1 py-4 md:flex-row md:gap-8"
        >
          <dt className="eyebrow text-muted-foreground/70 md:w-48 md:shrink-0 md:pt-1">
            {item.term}
          </dt>
          <dd className="text-foreground leading-relaxed">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Bulleted list with the site's square markers rather than browser dots. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span
            aria-hidden
            className="bg-accent mt-2 size-1.5 shrink-0"
          />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Inline link styled to match body copy in the legal documents. */
export function LegalLink({
  href,
  children,
  external,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
}) {
  const className =
    'text-foreground hover:text-accent underline decoration-border hover:decoration-accent underline-offset-4 transition-colors'

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
