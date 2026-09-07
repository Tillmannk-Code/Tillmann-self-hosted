import { Container } from '@/components/container'
import { positioning } from '@/lib/content'

// Rotate the accent trio across the stat figures so each fact gets its own hue.
const STAT_ACCENTS = ['text-accent', 'text-accent-2', 'text-accent-3']

export function Positioning() {
  return (
    <section className="bg-surface rule-t rule-b py-20 md:py-28">
      <Container className="flex flex-col gap-16">
        <div className="flex gap-6 md:gap-10">
          <span
            aria-hidden
            className="mt-3 hidden h-[2px] w-16 shrink-0 bg-gradient-to-r from-accent via-accent-3 to-accent-2 md:block lg:w-28"
          />
          <p className="max-w-4xl text-[clamp(1.375rem,3.4vw,2.5rem)] leading-[1.2] font-medium tracking-tight text-pretty">
            {positioning.statement}
          </p>
        </div>

        <dl className="border-border flex flex-col border-t sm:flex-row">
          {positioning.facts.map((fact, i) => (
            <div
              key={fact.label}
              className="border-border flex flex-1 flex-col gap-2 border-b py-6 sm:border-b-0 sm:not-first:border-l sm:not-first:pl-8"
            >
              <dt className="eyebrow text-muted-foreground order-2">
                {fact.label}
              </dt>
              <dd className={`${STAT_ACCENTS[i % STAT_ACCENTS.length]} order-1 text-[clamp(2rem,5vw,3.5rem)] leading-none font-bold tracking-tighter`}>
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
