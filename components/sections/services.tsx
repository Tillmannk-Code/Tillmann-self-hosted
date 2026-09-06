import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { services } from '@/lib/content'

export function Services() {
  return (
    <section id="services" className="scroll-mt-16 py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeading number="04" label="How I may help your business" />

        <div className="flex flex-col">
          {services.map((service, i) => (
            <article
              key={service.id}
              className="flex flex-col gap-8 py-12 not-last:rule-b md:flex-row md:gap-16 md:py-16"
            >
              <div className="flex flex-col gap-5 md:w-2/5">
                <span className="eyebrow text-accent">
                  S{String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display text-[clamp(1.75rem,4vw,3rem)] text-balance">
                  {service.title}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-border text-muted-foreground rounded-sm border px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-foreground/80 flex flex-col gap-5 text-base leading-relaxed md:w-3/5 md:text-lg">
                {service.body.split('\n\n').map((para) => (
                  <p key={para.slice(0, 32)} className="text-pretty">
                    {para}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
