'use client'

import Script from 'next/script'
import { useCallback, useEffect, useRef, useState } from 'react'
import { legalRoutes } from '@/lib/legal'
import {
  CONSENT_REOPEN_EVENT,
  type StoredConsent,
  clearAnalyticsCookies,
  readStoredConsent,
  writeStoredConsent,
} from '@/lib/consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/**
 * Google Consent Mode v2 defaults, pushed before the tag ever runs.
 *
 * Everything starts denied. The tag then loads in "consent pending" mode and
 * stores nothing until an explicit grant arrives, which is what makes the
 * opt-in lawful under § 25 TDDDG rather than merely well-intentioned.
 */
const CONSENT_DEFAULTS = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
`

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function pushConsentUpdate(granted: boolean) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  // Using dataLayer.push directly rather than window.gtag, because the helper
  // only exists once the defaults script has run.
  window.dataLayer.push([
    'consent',
    'update',
    {
      analytics_storage: granted ? 'granted' : 'denied',
    },
  ])
}

export function ConsentManager() {
  const [consent, setConsent] = useState<StoredConsent>(null)
  // Distinguishes "read from storage, nothing there" from "not read yet", so
  // the banner never flashes on a page load where consent already exists.
  const [hydrated, setHydrated] = useState(false)
  const [reopened, setReopened] = useState(false)

  useEffect(() => {
    setConsent(readStoredConsent())
    setHydrated(true)
  }, [])

  useEffect(() => {
    const onReopen = () => setReopened(true)
    window.addEventListener(CONSENT_REOPEN_EVENT, onReopen)
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, onReopen)
  }, [])

  const decide = useCallback((value: 'granted' | 'denied') => {
    writeStoredConsent(value)
    setConsent(value)
    setReopened(false)

    if (value === 'denied') {
      // Withdrawal: the tag may already be running from an earlier grant, so
      // revoke explicitly and remove what it stored.
      pushConsentUpdate(false)
      clearAnalyticsCookies()
    }
    // On a grant, no push happens here on purpose. The scripts below mount in
    // the same commit and push `default: denied` followed by
    // `update: granted` in the order Consent Mode expects. Pushing an update
    // here as well would land it *before* the defaults and duplicate it.
  }, [])

  // No measurement ID configured: render nothing at all. Showing a cookie
  // banner for a tag that cannot load would be asking permission for
  // something that never happens.
  if (!GA_ID) return null

  const showBanner = hydrated && (consent === null || reopened)

  return (
    <>
      {consent === 'granted' ? (
        <>
          <Script id="ga-consent-defaults" strategy="afterInteractive">
            {`${CONSENT_DEFAULTS}
gtag('consent', 'update', { analytics_storage: 'granted' });`}
          </Script>
          <Script
            id="ga-tag"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}

      {showBanner ? (
        <ConsentBanner
          onAccept={() => decide('granted')}
          onDecline={() => decide('denied')}
          current={consent}
        />
      ) : null}
    </>
  )
}

function ConsentBanner({
  onAccept,
  onDecline,
  current,
}: {
  onAccept: () => void
  onDecline: () => void
  current: StoredConsent
}) {
  const ref = useRef<HTMLDivElement>(null)

  /**
   * A `fixed` banner is painted over the page, so on a short viewport it hides
   * whatever sits at the bottom — the testimonial carousel's controls, the
   * footer links. Reserving its height as page padding pushes that content up
   * instead of burying it.
   *
   * The height is measured rather than hardcoded because the copy rewraps
   * between the stacked mobile layout and the single-row desktop one.
   */
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const apply = () => {
      document.body.style.paddingBottom = `${el.offsetHeight}px`
    }
    apply()

    const observer = new ResizeObserver(apply)
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.body.style.paddingBottom = ''
    }
  }, [])

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Analytics cookie consent"
      className="bg-surface rule-t fixed inset-x-0 bottom-0 z-50"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10">
        <div className="flex flex-col gap-2">
          <p className="eyebrow text-accent">Analytics</p>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            I&apos;d like to use Google Analytics to understand which pages are
            worth writing more of. It sets cookies and sends data to Google, so
            it only runs if you agree. The site works exactly the same either
            way.{' '}
            <a
              href={legalRoutes.privacy.en}
              className="text-foreground hover:text-accent decoration-border hover:decoration-accent underline underline-offset-4 transition-colors"
            >
              Privacy policy
            </a>
          </p>
        </div>

        {/*
          Both buttons are the same size and sit side by side. German data
          protection authorities treat a visually subordinate "reject" as
          invalid consent, so declining has to be exactly as easy as accepting.
        */}
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={onDecline}
            className="eyebrow border-border hover:border-accent hover:text-accent flex-1 border px-5 py-3 transition-colors md:flex-none"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="eyebrow bg-accent text-accent-foreground hover:bg-accent/85 flex-1 px-5 py-3 font-bold transition-colors md:flex-none"
          >
            {current === 'denied' ? 'Allow' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Footer control that re-opens the banner.
 *
 * GDPR Art. 7(3) requires withdrawing consent to be as easy as giving it, so
 * there has to be a permanent, reachable way back to this choice.
 */
export function ConsentSettingsButton({
  className,
}: {
  className?: string
}) {
  if (!GA_ID) return null

  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))
      }
      className={className}
    >
      Cookie settings
    </button>
  )
}
