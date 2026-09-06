'use client'

import { useEffect, useState } from 'react'

import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { clients } from '@/lib/content'

type Client = (typeof clients)[number]

/** Fisher-Yates — unbiased, unlike the `sort(() => Math.random() - 0.5)` trick. */
function shuffle(input: readonly Client[]): Client[] {
  const out = [...input]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

type RowProps = {
  items: Client[]
  direction: 'left' | 'right'
  /** Seconds for one full cycle. Rows differ so they never march in lockstep. */
  duration: number
}

function MarqueeRow({ items, direction, duration }: RowProps) {
  const names = items.map((c) => c.name)

  return (
    <div className="group bg-background marquee-mask relative overflow-hidden md:[--marquee-fade:8rem]">
      <ul
        data-marquee-track
        className="flex w-max items-center group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
        }}
      >
        {/*
          The list is rendered twice: the first copy is the real, readable one
          and the second is a visual filler that makes the -50% loop seamless.
        */}
        {names.map((name) => (
          <li
            key={name}
            className="border-border shrink-0 border-l px-8 py-7 md:px-10"
          >
            <span className="text-muted-foreground hover:text-foreground text-lg font-bold tracking-tight whitespace-nowrap transition-colors md:text-xl">
              {name}
            </span>
          </li>
        ))}
        {names.map((name) => (
          <li
            key={`dupe-${name}`}
            data-marquee-dupe
            aria-hidden
            className="border-border shrink-0 border-l px-8 py-7 md:px-10"
          >
            <span className="text-muted-foreground text-lg font-bold tracking-tight whitespace-nowrap md:text-xl">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ClientWall() {
  // Server and first client render use the canonical order, so hydration
  // matches; the shuffle then runs once on mount for a fresh order per load.
  const [order, setOrder] = useState<Client[]>(() => [...clients])

  useEffect(() => {
    setOrder(shuffle(clients))
  }, [])

  const mid = Math.ceil(order.length / 2)
  const topRow = order.slice(0, mid)
  const bottomRow = order.slice(mid)

  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading number="02" label="Brands I have worked for" />
      </Container>

      {/* Full-bleed: the rows run edge to edge, outside the container gutters. */}
      <div className="bg-border mt-8 flex flex-col gap-px">
        <MarqueeRow items={topRow} direction="left" duration={44} />
        <MarqueeRow items={bottomRow} direction="right" duration={52} />
      </div>
    </section>
  )
}
