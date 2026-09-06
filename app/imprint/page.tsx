import type { Metadata } from 'next'
import {
  LegalFacts,
  LegalLink,
  LegalSection,
  LegalShell,
} from '@/components/legal/legal-shell'
import { addressLines, entity, legalRoutes } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Imprint',
  description:
    'Legal notice and provider identification for tillmann24.com — Tillmann Kühn, Berlin, Germany.',
  alternates: {
    canonical: legalRoutes.imprint.en,
    languages: {
      de: legalRoutes.imprint.de,
      en: legalRoutes.imprint.en,
    },
  },
  robots: { index: true, follow: true, 'max-snippet': 0 },
}

export default function ImprintPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Imprint"
      intro="Provider identification under § 5 of the German Digital Services Act (DDG) and § 18 (2) of the German State Media Treaty (MStV)."
      altHref={legalRoutes.imprint.de}
      altLabel="Deutsch"
    >
      {/*
        The German text is the legally binding one, so the English version says
        so up front rather than presenting itself as an equal authority.
      */}
      <div className="border-accent/40 bg-surface border-l-2 px-5 py-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          This is a courtesy translation. The{' '}
          <LegalLink href={legalRoutes.imprint.de}>German version</LegalLink> is
          the legally binding text.
        </p>
      </div>

      <LegalSection heading="Provider">
        <LegalFacts
          items={[
            {
              term: 'Name',
              value: (
                <>
                  {entity.name}
                  <br />
                  <span className="text-muted-foreground">
                    Sole proprietorship
                  </span>
                </>
              ),
            },
            {
              term: 'Address',
              value: (
                <span className="whitespace-pre-line">
                  {addressLines.slice(1).join('\n')}
                  {'\n'}
                  {entity.country}
                </span>
              ),
            },
            {
              term: 'Email',
              value: (
                <LegalLink href={`mailto:${entity.imprintEmail}`}>
                  {entity.imprintEmail}
                </LegalLink>
              ),
            },
            {
              term: 'VAT ID',
              value: (
                <>
                  {entity.vatId}
                  <br />
                  <span className="text-muted-foreground text-sm">
                    VAT identification number under § 27 a of the German VAT Act
                  </span>
                </>
              ),
            },
          ]}
        />
        <p className="text-muted-foreground/70 text-sm leading-relaxed">
          The address given is a business address (c/o WeWork) and serves as the
          address for service of process under § 5 DDG.
        </p>
      </LegalSection>

      <LegalSection heading="Responsible for content">
        <p>
          Responsible for journalistic and editorial content under § 18 (2)
          MStV — in particular the articles in the Journal:
        </p>
        <p className="text-foreground whitespace-pre-line">
          {addressLines.join('\n')}
        </p>
      </LegalSection>

      <LegalSection heading="Legal enquiries">
        <p>
          For legal matters, complaints or notices regarding content on this
          website:{' '}
          <LegalLink href={`mailto:${entity.legalEmail}`}>
            {entity.legalEmail}
          </LegalLink>
        </p>
      </LegalSection>

      <LegalSection heading="Professional activity">
        <p>
          Freelance consulting in marketing, CRM and analytics. There is no
          membership of a professional chamber and no professional regulations
          apply within the meaning of § 5 (1) no. 5 DDG.
        </p>
      </LegalSection>

      <LegalSection heading="Dispute resolution">
        <p>
          The European Commission provides a platform for online dispute
          resolution:{' '}
          <LegalLink href="https://ec.europa.eu/consumers/odr/" external>
            ec.europa.eu/consumers/odr
          </LegalLink>
        </p>
        <p>
          I am neither obliged nor willing to participate in dispute resolution
          proceedings before a consumer arbitration board.
        </p>
      </LegalSection>

      <LegalSection heading="Liability for content">
        <p>
          As a service provider, I am responsible for my own content on these
          pages under § 7 (1) DDG and general law. Under §§ 8 to 10 DDG,
          however, I am not obliged to monitor transmitted or stored third-party
          information, or to investigate circumstances that indicate unlawful
          activity.
        </p>
        <p>
          Obligations to remove or block the use of information under general
          law remain unaffected. Liability in this respect is only possible from
          the point at which a specific infringement becomes known. Should I
          become aware of any such infringement, I will remove the content
          immediately.
        </p>
      </LegalSection>

      <LegalSection heading="Liability for links">
        <p>
          This website contains links to external third-party websites over
          whose content I have no control. I therefore cannot accept any
          responsibility for that third-party content. The respective provider
          or operator of the linked pages is always responsible for their
          content.
        </p>
        <p>
          Linked pages were checked for possible legal violations at the time of
          linking. Unlawful content was not identifiable at that time. Permanent
          monitoring of the content of linked pages is not reasonable without
          concrete evidence of an infringement.
        </p>
      </LegalSection>

      <LegalSection heading="Copyright">
        <p>
          The content and works created by the site operator on these pages are
          subject to German copyright law. Reproduction, editing, distribution
          and any form of exploitation beyond the limits of copyright require
          the written consent of the respective author or creator.
        </p>
        <p>
          Third-party brand names, company names and logos referenced on this
          site are the property of their respective owners and are used solely
          to describe completed projects.
        </p>
      </LegalSection>

      <LegalSection heading="Data protection">
        <p>
          For information on the processing of personal data, please see the{' '}
          <LegalLink href={legalRoutes.privacy.en}>privacy policy</LegalLink>.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
