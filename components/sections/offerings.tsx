import { ArrowUpRight, Plus } from 'lucide-react'
import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { offerings } from '@/lib/content'

/**
 * Index-style list: big titles only, details fold out on demand. Native
 * <details> keeps every body in the DOM (crawlable, no JS required).
 */
export function Offerings() {
  return (
    <section id="offerings" className="scroll-mt-20 py-20 md:py-28">
      <Container className="flex flex-col gap-16">
        <SectionHeading label="Ways to work together" />

        <ul className="border-foreground/10 border-t">
          {offerings.map((offering, i) => (
            <li key={offering.title} className="border-foreground/10 border-b">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-6 py-7 md:gap-10 md:py-9 [&::-webkit-details-marker]:hidden">
                  <span className="eyebrow text-muted-foreground/50 group-hover:text-accent group-open:text-accent w-8 shrink-0 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="display text-muted-foreground group-hover:text-foreground group-open:text-foreground flex-1 text-[clamp(2rem,5.5vw,4.75rem)] transition-colors duration-300">
                    {offering.title}
                  </h3>
                  <span className="border-foreground/15 group-hover:border-accent group-open:bg-accent group-open:border-accent group-open:text-accent-foreground flex size-12 shrink-0 items-center justify-center rounded-full border transition-colors">
                    <Plus
                      aria-hidden
                      className="size-5 transition-transform duration-300 group-open:rotate-45"
                    />
                  </span>
                </summary>

                <div className="flex flex-col gap-5 pb-10 pl-14 md:flex-row md:items-end md:justify-between md:pl-18">
                  <p className="text-foreground/75 max-w-2xl text-lg leading-relaxed text-pretty">
                    {offering.body}
                  </p>
                  {offering.link ? (
                    <a
                      href={offering.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="navlabel text-accent hover:border-accent inline-flex w-fit shrink-0 items-center gap-2 border-b border-transparent pb-1 transition-colors"
                    >
                      {offering.link.label}
                      <ArrowUpRight aria-hidden className="size-4" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
