import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/container'
import { Cta } from '@/components/cta'
import { contact, site } from '@/lib/content'

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 py-20 md:py-32">
      <Container className="flex flex-col gap-12">
        <h2 className="display text-[clamp(3rem,14vw,10rem)]">
          {contact.heading}
          <span className="text-accent">.</span>
        </h2>

        <div className="rule-t flex flex-col gap-10 pt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <p className="text-foreground/90 max-w-xl text-lg leading-relaxed text-pretty md:text-xl">
            {contact.body}
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              <Cta href={site.bookingUrl}>
                Book a call
                <ArrowUpRight className="size-3.5" strokeWidth={2} />
              </Cta>
              <Cta href={`mailto:${site.email}`} variant="outline">
                {site.email}
              </Cta>
            </div>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-muted-foreground hover:text-accent inline-flex items-center gap-1.5 transition-colors"
            >
              LinkedIn
              <ArrowUpRight className="size-3" strokeWidth={2} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
