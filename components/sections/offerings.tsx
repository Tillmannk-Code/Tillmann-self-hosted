import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { offerings } from '@/lib/content'

export function Offerings() {
  return (
    <section id="offerings" className="scroll-mt-16 py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeading number="06" label="Solutions for You" />

        <ul className="bg-border grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((offering, i) => (
            <li
              key={offering.title}
              className="bg-background group hover:bg-surface flex flex-col gap-4 p-8 transition-colors md:p-10"
            >
              <span className="eyebrow text-muted-foreground/50 group-hover:text-accent transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-balance md:text-2xl">
                {offering.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {offering.body}
              </p>

              {offering.link ? (
                // mt-auto pins the link to the bottom of the cell so it lines
                // up across the row regardless of how long each body runs.
                <a
                  href={offering.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow text-accent hover:border-accent focus-visible:ring-accent mt-auto inline-flex w-fit items-center gap-2 border-b border-transparent pb-1 transition-colors focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent focus-visible:outline-none"
                >
                  {offering.link.label}
                  {/*
                    An SVG icon, not the "↗" character — that codepoint has
                    emoji presentation and renders as a colour bitmap that
                    ignores the accent colour. This inherits currentColor.
                  */}
                  <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
