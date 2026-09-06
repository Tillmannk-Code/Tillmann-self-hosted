import { Container } from '@/components/container'
import { positioning } from '@/lib/content'

export function Positioning() {
  return (
    <section className="bg-surface rule-t rule-b py-20 md:py-28">
      <Container className="flex flex-col gap-16">
        <div className="flex gap-6 md:gap-10">
          <span
            aria-hidden
            className="bg-accent mt-3 hidden h-[2px] w-16 shrink-0 md:block lg:w-28"
          />
          <p className="max-w-4xl text-[clamp(1.375rem,3.4vw,2.5rem)] leading-[1.2] font-medium tracking-tight text-pretty">
            {positioning.statement}
          </p>
        </div>

        <dl className="border-border flex flex-col border-t sm:flex-row">
          {positioning.facts.map((fact) => (
            <div
              key={fact.label}
              className="border-border flex flex-1 flex-col gap-2 border-b py-6 sm:border-b-0 sm:not-first:border-l sm:not-first:pl-8"
            >
              <dt className="eyebrow text-muted-foreground order-2">
                {fact.label}
              </dt>
              <dd className="text-accent order-1 text-[clamp(2rem,5vw,3.5rem)] leading-none font-bold tracking-tighter">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
