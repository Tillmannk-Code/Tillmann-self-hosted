import { Plus } from 'lucide-react'
import Image from 'next/image'
import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { services } from '@/lib/content'
import { cn } from '@/lib/utils'

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 py-20 md:py-28">
      <Container className="flex flex-col gap-20 md:gap-32">
        <SectionHeading label="How I can help" title="Three disciplines. One growth engine." />

        <div className="flex flex-col gap-24 md:gap-36">
          {services.map((service, i) => (
            <article
              key={service.id}
              className={cn(
                'flex flex-col gap-10 md:items-center md:gap-16',
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
              )}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl md:w-1/2">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="scroll-frame object-cover"
                />
              </div>

              <div className="flex flex-col gap-6 md:w-1/2">
                <span className="eyebrow text-accent">
                  {String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                </span>
                <h3 className="display text-[clamp(2.25rem,4.5vw,4rem)] text-balance">
                  {service.title}
                </h3>
                <p className="text-foreground/75 max-w-lg text-lg leading-relaxed text-pretty">
                  {service.summary}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-foreground/15 text-muted-foreground rounded-full border px-3.5 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {/* Full write-up stays in the DOM for search engines, folded by default. */}
                <details className="group border-foreground/10 max-w-xl border-t pt-5">
                  <summary className="navlabel text-muted-foreground hover:text-foreground flex w-fit cursor-pointer list-none items-center gap-2 transition-colors [&::-webkit-details-marker]:hidden">
                    <Plus
                      aria-hidden
                      className="text-accent size-4 transition-transform duration-300 group-open:rotate-45"
                    />
                    <span className="group-open:hidden">Read more</span>
                    <span className="hidden group-open:inline">Show less</span>
                  </summary>
                  <div className="text-muted-foreground mt-5 flex flex-col gap-4 leading-relaxed">
                    {service.body.split('\n\n').map((para) => (
                      <p key={para.slice(0, 32)} className="text-pretty">
                        {para}
                      </p>
                    ))}
                  </div>
                </details>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
