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
    <header className="bg-background/80 rule-b fixed inset-x-0 top-0 z-50 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
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

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
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
        <div id="mobile-nav" className="rule-t bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-foreground border-border/60 border-b py-4 text-2xl font-bold tracking-tight"
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
