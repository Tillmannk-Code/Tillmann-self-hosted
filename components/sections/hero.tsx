import { ArrowDownRight } from 'lucide-react'
import { Container } from '@/components/container'
import { Cta } from '@/components/cta'
import { hero, site } from '@/lib/content'
import { cn } from '@/lib/utils'

// Bold & colorful: the stacked wordmark walks through the accent trio, the
// final line landing on the magenta lead so the CTA below reads as its echo.
const ACCENT_CYCLE = ['text-accent-2', 'text-accent-3', 'text-accent']

export function Hero() {
  // pt-16 clears the fixed h-16 header and must stay. The container's own top
  // padding is the actual visual gap, and it can be tighter than the bottom
  // padding: the display type carries ~13px of optical space above its cap
  // height, so matching the two numbers reads as a larger gap than it is.
  return (
    <section className="pt-16">
      <Container className="flex flex-col gap-10 pt-8 pb-16 md:pt-10 md:pb-24">
        {/* Signature element: the stacked wordmark, each line a different accent */}
        <h1 className="flex flex-col">
          {hero.words.map((word, i) => (
            <span
              key={word}
              className="rule-b flex items-end justify-between gap-6 py-1 md:py-2"
            >
              <span
                className={cn(
                  'display text-[clamp(2.75rem,13vw,11rem)] transition-colors',
                  ACCENT_CYCLE[i % ACCENT_CYCLE.length],
                )}
              >
                {word}
              </span>
              <span
                aria-hidden
                className="eyebrow text-muted-foreground/40 shrink-0 pb-2 max-[359px]:hidden md:pb-4"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </span>
          ))}
        </h1>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="text-foreground/90 max-w-xl text-lg leading-relaxed text-pretty md:text-xl">
            {hero.lede}
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Cta href={site.bookingUrl}>
              Book a call
              <ArrowDownRight className="size-3.5" strokeWidth={2} />
            </Cta>
            <Cta href="/#work" variant="outline">
              See the work
            </Cta>
          </div>
        </div>
      </Container>
    </section>
  )
}
