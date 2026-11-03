'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Container } from '@/components/container'
import { Cta } from '@/components/cta'
import { nav, site } from '@/lib/content'

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="from-background/90 fixed inset-x-0 top-0 z-50 bg-gradient-to-b to-transparent backdrop-blur-[2px]">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-baseline gap-2"
            onClick={() => setOpen(false)}
          >
            <span className="text-base font-bold tracking-tight">
              Tillmann Kühn
            </span>
            <span
              aria-hidden
              className="bg-accent hidden h-1.5 w-1.5 rounded-full sm:block"
            />
          </Link>

          <nav
            aria-label="Main"
            className="border-foreground/10 bg-background/40 hidden items-center gap-8 rounded-full border px-7 py-3 backdrop-blur-md md:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="navlabel text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Cta href={site.bookingUrl}>Book a call</Cta>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="text-foreground md:hidden"
          >
            {open ? (
              <X className="size-5" strokeWidth={1.5} />
            ) : (
              <Menu className="size-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </Container>

      {open ? (
        <div id="mobile-nav" className="bg-background h-[calc(100svh-5rem)] md:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="display text-foreground border-border/60 border-b py-5 text-4xl"
              >
                {item.label}
              </Link>
            ))}
            <Cta href={site.bookingUrl} className="mt-5">
              Book a call
            </Cta>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
