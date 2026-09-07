import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, JetBrains_Mono } from 'next/font/google'
import { ChatWidget } from '@/components/chat/chat-widget'
import { ConsentManager } from '@/components/consent-manager'
import { JsonLd } from '@/components/json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteNav } from '@/components/site-nav'
import { site } from '@/lib/content'
import {
  graph,
  personSchema,
  serviceSchema,
  websiteSchema,
} from '@/lib/schema'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Tillmann Kühn — Growth, CRM & Dashboard Consultant',
    template: '%s — Tillmann Kühn',
  },
  description:
    'Freelance marketing, CRM and analytics consultant with 15+ years building growth engines for enterprises and startups — Lufthansa, McDonald\u2019s, NIVEA, unu.',
  keywords: [
    'CRM consultant',
    'marketing consultant',
    'analytics consultant',
    'fractional CMO',
    'growth consultant',
    'interim marketing management',
    'Braze',
    'lifecycle marketing',
  ],
  authors: [{ name: 'Tillmann Kühn', url: site.url }],
  creator: 'Tillmann Kühn',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.url,
    siteName: 'Tillmann Kühn',
    title: 'Tillmann Kühn — Growth, CRM & Dashboard Consultant',
    description:
      'Freelance marketing, CRM and analytics consultant with 15+ years building growth engines for enterprises and startups.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tillmann Kühn — Growth, CRM & Dashboard Consultant',
    description:
      'Freelance marketing, CRM and analytics consultant with 15+ years building growth engines for enterprises and startups.',
  },
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google show full-length text snippets and large image previews;
      // the defaults are more conservative and truncate rich results.
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  generator: 'v0.app',
  // No `icons` key on purpose: app/icon.svg and app/apple-icon.tsx are picked
  // up by Next's file conventions and hashed for cache-busting. Declaring
  // icons here would override those with unhashed paths.
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0A0912',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
        className={`bg-background ${geist.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        {/*
          Person / ProfessionalService / WebSite are true of every page, so they
          live in the layout. Page-specific nodes (BlogPosting, BreadcrumbList)
          are added by the individual routes and resolve against these by @id.
        */}
        <JsonLd
          data={graph(personSchema(), serviceSchema(), websiteSchema())}
        />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
        {/*
          Vercel Analytics is cookieless and needs no consent, so it loads
          unconditionally. Google Analytics is gated behind ConsentManager,
          which loads the tag only after an explicit opt-in.
        */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <ConsentManager />
        <ChatWidget />
      </body>
    </html>
  )
}
