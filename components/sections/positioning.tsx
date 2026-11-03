import { Container } from '@/components/container'
import { positioning } from '@/lib/content'

export function Positioning() {
  const words = positioning.headline.split(' ')

  return (
    <section className="py-28 md:py-44">
      <Container className="flex flex-col gap-20 md:gap-28">
        {/* Each word lights up as it scrolls through the viewport. */}
        <p className="display max-w-6xl text-[clamp(2rem,5.2vw,4.75rem)] leading-[1.05] text-pretty">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="scroll-word">
              {word}{' '}
            </span>
          ))}
        </p>

        <dl className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {positioning.facts.map((fact) => (
            <div key={fact.label} className="border-foreground/10 flex flex-col gap-3 border-t pt-6">
              <dt className="eyebrow text-muted-foreground order-2">{fact.label}</dt>
              <dd className="display order-1 text-[clamp(3.5rem,8vw,7rem)] tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
