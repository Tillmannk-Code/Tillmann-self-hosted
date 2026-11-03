import { ArrowDownRight } from 'lucide-react'
import Image from 'next/image'
import { Container } from '@/components/container'
import { Cta } from '@/components/cta'
import { hero, site } from '@/lib/content'

export function Hero() {
  const [first, second, last] = hero.words

  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden">
      {/* Signature element: the cinematic light-painting plate */}
      <div aria-hidden className="scroll-hero-media absolute inset-0 -z-10 origin-center">
        <Image
          src="/images/hero-signal.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="from-background/80 absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
      </div>

      <Container className="scroll-hero-copy flex flex-col gap-10 pt-32 pb-14 md:pb-20">
        <p
          className="rise eyebrow text-muted-foreground flex items-center gap-3"
          style={{ '--d': '100ms' } as React.CSSProperties}
        >
          <span aria-hidden className="bg-accent size-1.5 rounded-full" />
          {site.tagline} — {site.location}
        </p>

        <h1 className="display text-[clamp(3.25rem,10.5vw,10.5rem)]">
          <span className="rise block" style={{ '--d': '200ms' } as React.CSSProperties}>
            {first}, {second}
          </span>
          <span className="rise block" style={{ '--d': '350ms' } as React.CSSProperties}>
            <span className="text-muted-foreground">{'& '}</span>
            <span className="text-accent glow">{last}</span>
          </span>
        </h1>

        <div
          className="rise flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          style={{ '--d': '550ms' } as React.CSSProperties}
        >
          <p className="text-foreground/80 max-w-md text-lg leading-relaxed text-pretty">
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
