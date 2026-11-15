import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { Container } from '@/components/container'
import { Cta } from '@/components/cta'
import { contact, site } from '@/lib/content'

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 px-4 py-20 md:px-6 md:py-28">
      <div className="relative isolate overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        <Image
          src="/images/hero-signal.png"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 scale-x-[-1] object-cover object-[30%_center] opacity-60"
        />
        <div aria-hidden className="from-background via-background/70 absolute inset-0 -z-10 bg-gradient-to-t to-background/30" />

        <Container className="flex min-h-[80svh] flex-col justify-end gap-12 py-16 md:py-24">
          <h2 className="display text-[clamp(4rem,15vw,13rem)]">
            {contact.heading}
            <span className="text-accent">.</span>
          </h2>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <p className="text-foreground/80 max-w-lg text-lg leading-relaxed text-pretty">
              {contact.body}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Cta href={site.bookingUrl}>
                Book a call
                <ArrowUpRight className="size-3.5" strokeWidth={2} />
              </Cta>
              <Cta href={`mailto:${site.email}`} variant="outline">
                {site.email}
              </Cta>
              <Cta href={site.linkedin} variant="outline">
                LinkedIn
              </Cta>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
