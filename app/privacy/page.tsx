import type { Metadata } from 'next'
import {
  LegalFacts,
  LegalLink,
  LegalList,
  LegalSection,
  LegalShell,
  LegalSubheading,
} from '@/components/legal/legal-shell'
import {
  addressLines,
  entity,
  formatLegalDate,
  legalLastUpdated,
  legalRoutes,
} from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for tillmann24.com — controller, hosting, analytics, Google Analytics consent and your rights under the GDPR.',
  alternates: {
    canonical: legalRoutes.privacy.en,
    languages: {
      de: legalRoutes.privacy.de,
      en: legalRoutes.privacy.en,
    },
  },
  robots: { index: true, follow: true, 'max-snippet': 0 },
}

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This policy explains which personal data is processed when you visit this website, on what legal basis, and what rights you have."
      lastUpdated={`Last updated: ${formatLegalDate(legalLastUpdated, 'en')}`}
      altHref={legalRoutes.privacy.de}
      altLabel="Deutsch"
    >
      <div className="border-accent/40 bg-surface border-l-2 px-5 py-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          This is a courtesy translation. The{' '}
          <LegalLink href={legalRoutes.privacy.de}>German version</LegalLink> is
          the legally binding text.
        </p>
      </div>

      <LegalSection id="controller" heading="1. Controller">
        <p>
          The controller responsible for data processing on this website within
          the meaning of Art. 4 (7) GDPR is:
        </p>
        <LegalFacts
          items={[
            {
              term: 'Controller',
              value: (
                <span className="whitespace-pre-line">
                  {addressLines.join('\n')}
                  {'\n'}
                  {entity.country}
                </span>
              ),
            },
            {
              term: 'Email',
              value: (
                <LegalLink href={`mailto:${entity.legalEmail}`}>
                  {entity.legalEmail}
                </LegalLink>
              ),
            },
          ]}
        />
        <p className="text-muted-foreground/70 text-sm leading-relaxed">
          No data protection officer has been appointed, as the conditions of §
          38 of the German Federal Data Protection Act are not met.
        </p>
      </LegalSection>

      <LegalSection id="principles" heading="2. Principles">
        <p>
          This website is deliberately built to collect as little as possible.
          There are no user accounts, no contact form, no newsletter and no
          advertising networks. Cookies are used only for analytics with Google
          Analytics — and only if you have explicitly agreed beforehand.
        </p>
      </LegalSection>

      <LegalSection id="hosting" heading="3. Hosting and server logs">
        <p>
          This website is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut,
          CA 91789, USA. When a page is requested, Vercel processes technically
          necessary connection data as a processor on my behalf:
        </p>
        <LegalList
          items={[
            'IP address of the requesting device',
            'date and time of the request',
            'URL requested and volume of data transferred',
            'HTTP status code and referrer URL',
            'browser and operating system used',
          ]}
        />
        <p>
          This data is technically required to operate and secure the website.
          The legal basis is Art. 6 (1) (f) GDPR; the legitimate interest lies
          in providing the website reliably and securely. A data processing
          agreement under Art. 28 GDPR is in place with Vercel.
        </p>
        <p>
          As Vercel is based in the USA, data may be transferred to a third
          country. Vercel is certified under the EU-U.S. Data Privacy Framework
          and EU standard contractual clauses are additionally in place. Further
          information:{' '}
          <LegalLink href="https://vercel.com/legal/privacy-policy" external>
            vercel.com/legal/privacy-policy
          </LegalLink>
        </p>
      </LegalSection>

      <LegalSection id="analytics" heading="4. Analytics">
        <LegalSubheading>Vercel Analytics (cookie-free)</LegalSubheading>
        <p>
          Vercel Analytics is used to measure page views. The service works
          without cookies and without cross-device recognition. It collects
          aggregated metrics such as page requested, referrer, device type and
          country; the IP address is not stored, but only used transiently to
          derive an anonymous identifier.
        </p>
        <p>
          The legal basis is Art. 6 (1) (f) GDPR. As no information is accessed
          on your device, no consent under § 25 TDDDG is required.
        </p>

        <LegalSubheading>Google Analytics 4 (consent only)</LegalSubheading>
        <p>
          If you have given your consent, Google Analytics 4 is used, operated
          by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
          Ireland. Google Analytics uses cookies that make it possible to
          analyse how this website is used. The data collected includes in
          particular:
        </p>
        <LegalList
          items={[
            'pages viewed, time on page and interactions',
            'truncated IP address (IP anonymisation is enabled)',
            'referrer, device type, browser and operating system',
            'approximate location at country or city level',
          ]}
        />
        <p>
          <strong className="text-foreground">Legal basis</strong> is your
          consent under Art. 6 (1) (a) GDPR in conjunction with § 25 (1) TDDDG.
          Without your consent the Google Analytics script is not loaded and no
          cookies are set. Google Consent Mode v2 is also used, which sets all
          consent types to &ldquo;denied&rdquo; by default.
        </p>
        <p>
          <strong className="text-foreground">Withdrawal:</strong> you can
          withdraw your consent at any time via the &ldquo;Cookie
          settings&rdquo; link in the footer. On withdrawal, any Google
          Analytics cookies already set are deleted and no further processing
          takes place. Withdrawal does not affect the lawfulness of processing
          carried out beforehand.
        </p>
        <p>
          <strong className="text-foreground">
            Transfers to third countries:
          </strong>{' '}
          data may be transferred to Google LLC in the USA. Google LLC is
          certified under the EU-U.S. Data Privacy Framework, and EU standard
          contractual clauses are additionally in place. It cannot be ruled out
          that US authorities may access this data.
        </p>
        <p>
          <strong className="text-foreground">Retention:</strong> usage data
          collected in Google Analytics is deleted automatically after 14
          months. Google Analytics cookies have a lifetime of up to 24 months.
        </p>
        <p>
          A data processing agreement is in place with Google. Further
          information:{' '}
          <LegalLink href="https://policies.google.com/privacy" external>
            policies.google.com/privacy
          </LegalLink>
        </p>
      </LegalSection>

      <LegalSection id="cookies" heading="5. Cookies in detail">
        <p>
          No strictly necessary cookies are set. Your consent decision itself is
          not stored in a cookie but in your browser&apos;s{' '}
          <code className="font-mono text-sm">localStorage</code>, so that your
          choice persists on a return visit. This information never leaves your
          device.
        </p>
        <LegalFacts
          items={[
            {
              term: '_ga, _ga_*',
              value:
                'Google Analytics — distinguishes visitors and sessions. Lifetime up to 24 months. Only set with consent.',
            },
            {
              term: 'tk-analytics-consent',
              value:
                'localStorage entry, not a cookie — stores your consent decision. No expiry; can be withdrawn at any time.',
            },
          ]}
        />
      </LegalSection>

      <LegalSection id="fonts" heading="6. Fonts and external content">
        <p>
          The fonts used (Geist and JetBrains Mono) are downloaded at
          build time and served from this site&apos;s own domain. No connection
          to Google Fonts is made when you load a page and no data is
          transmitted to Google.
        </p>
        <p>
          This website embeds no external videos, maps, social media plugins or
          advertising networks.
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="7. Contact by email">
        <p>
          If you contact me by email, the data you provide (name, email address,
          message content) is processed in order to handle your enquiry. The
          legal basis is Art. 6 (1) (b) GDPR for contract-related enquiries, and
          otherwise Art. 6 (1) (f) GDPR.
        </p>
        <p>
          The data is deleted once your enquiry has been dealt with conclusively
          and no statutory retention obligations — in particular under
          commercial and tax law — prevent deletion.
        </p>
      </LegalSection>

      <LegalSection id="rights" heading="8. Your rights">
        <p>You have the following rights in relation to the controller:</p>
        <LegalList
          items={[
            <>
              <strong className="text-foreground">Access</strong> to the
              personal data processed about you (Art. 15 GDPR)
            </>,
            <>
              <strong className="text-foreground">Rectification</strong> of
              inaccurate data (Art. 16 GDPR)
            </>,
            <>
              <strong className="text-foreground">Erasure</strong> of your data
              (Art. 17 GDPR)
            </>,
            <>
              <strong className="text-foreground">Restriction</strong> of
              processing (Art. 18 GDPR)
            </>,
            <>
              <strong className="text-foreground">Data portability</strong>{' '}
              (Art. 20 GDPR)
            </>,
            <>
              <strong className="text-foreground">Objection</strong> to
              processing based on legitimate interests (Art. 21 GDPR)
            </>,
            <>
              <strong className="text-foreground">Withdrawal</strong> of consent
              already given, with effect for the future (Art. 7 (3) GDPR)
            </>,
          ]}
        />
        <p>
          To exercise these rights, a message to{' '}
          <LegalLink href={`mailto:${entity.legalEmail}`}>
            {entity.legalEmail}
          </LegalLink>{' '}
          is sufficient.
        </p>
      </LegalSection>

      <LegalSection id="complaint" heading="9. Right to lodge a complaint">
        <p>
          You also have the right to lodge a complaint with a data protection
          supervisory authority (Art. 77 GDPR). The competent authority is that
          of the federal state in which the controller is based:
        </p>
        <p className="text-foreground whitespace-pre-line">
          {[
            'Berliner Beauftragte für Datenschutz und Informationsfreiheit',
            'Alt-Moabit 59-61',
            '10555 Berlin, Germany',
          ].join('\n')}
        </p>
        <p>
          <LegalLink href="https://www.datenschutz-berlin.de" external>
            datenschutz-berlin.de
          </LegalLink>
        </p>
      </LegalSection>

      <LegalSection id="changes" heading="10. Changes to this policy">
        <p>
          This privacy policy will be updated if data processing on this website
          changes or if a change in the legal situation requires it. The version
          available here applies.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
