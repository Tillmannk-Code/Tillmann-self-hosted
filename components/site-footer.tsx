import Link from 'next/link'
import { ConsentSettingsButton } from '@/components/consent-manager'
import { Container } from '@/components/container'
import { nav, site } from '@/lib/content'
import { legalRoutes } from '@/lib/legal'

const linkClass =
  'navlabel text-muted-foreground hover:text-accent transition-colors'

export function SiteFooter() {
  return (
    <footer className="rule-t">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-xl font-bold tracking-tight">{site.name}</span>
          <span className="eyebrow text-muted-foreground">{site.role}</span>
          <span className="eyebrow text-muted-foreground/60">
            {site.location}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              LinkedIn
            </a>
          </nav>

          {/* Sibling brands run by Tillmann, kept separate from this site's own nav. */}
          <nav aria-label="Other projects" className="flex flex-col gap-3">
            <span className="eyebrow text-muted-foreground/60">Also by me</span>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <a
                href="https://godashly.com"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                godashly.com
              </a>
              <a
                href="https://fymos.ai"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                fymos.ai
              </a>
            </div>
          </nav>
        </div>

        {/*
          Legal links sit in their own nav rather than beside the section
          anchors: German law requires the Impressum to be reachable from every
          page, and grouping it with the privacy policy and the consent control
          makes it findable where visitors already look for it.
        */}
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <Link href={legalRoutes.imprint.de} className={linkClass}>
            Impressum
          </Link>
          <Link href={legalRoutes.privacy.en} className={linkClass}>
            Privacy
          </Link>
          <ConsentSettingsButton className={linkClass} />
          <span className="eyebrow text-muted-foreground/50">
            © {new Date().getFullYear()}
          </span>
        </nav>
      </Container>
    </footer>
  )
}
