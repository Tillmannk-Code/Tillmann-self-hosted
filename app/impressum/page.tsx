import type { Metadata } from 'next'
import {
  LegalFacts,
  LegalLink,
  LegalSection,
  LegalShell,
} from '@/components/legal/legal-shell'
import { addressLines, entity, legalRoutes } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Impressum',
  description:
    'Impressum und Anbieterkennzeichnung gemäß § 5 DDG für tillmann24.com — Tillmann Kühn, Berlin.',
  alternates: {
    canonical: legalRoutes.imprint.de,
    languages: {
      de: legalRoutes.imprint.de,
      en: legalRoutes.imprint.en,
    },
  },
  // Legally required to be reachable, but it should never outrank the actual
  // content of the site.
  robots: { index: true, follow: true, 'max-snippet': 0 },
}

export default function ImpressumPage() {
  return (
    <LegalShell
      eyebrow="Rechtliches"
      title="Impressum"
      intro="Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV)."
      altHref={legalRoutes.imprint.en}
      altLabel="English"
    >
      <LegalSection heading="Anbieter">
        <LegalFacts
          items={[
            {
              term: 'Name',
              value: (
                <>
                  {entity.name}
                  <br />
                  <span className="text-muted-foreground">
                    Einzelunternehmen
                  </span>
                </>
              ),
            },
            {
              term: 'Anschrift',
              value: (
                <span className="whitespace-pre-line">
                  {addressLines.slice(1).join('\n')}
                  {'\n'}
                  {entity.countryDe}
                </span>
              ),
            },
            {
              term: 'E-Mail',
              value: (
                <LegalLink href={`mailto:${entity.imprintEmail}`}>
                  {entity.imprintEmail}
                </LegalLink>
              ),
            },
            {
              term: 'Umsatzsteuer-ID',
              value: (
                <>
                  {entity.vatId}
                  <br />
                  <span className="text-muted-foreground text-sm">
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a
                    Umsatzsteuergesetz
                  </span>
                </>
              ),
            },
          ]}
        />
        <p className="text-muted-foreground/70 text-sm leading-relaxed">
          Die angegebene Anschrift ist eine Geschäftsadresse (c/o WeWork) und
          dient als ladungsfähige Adresse im Sinne des § 5 DDG.
        </p>
      </LegalSection>

      <LegalSection heading="Verantwortlich für den Inhalt">
        <p>
          Verantwortlich für journalistisch-redaktionelle Inhalte gemäß § 18
          Abs. 2 MStV — insbesondere die Beiträge im Journal:
        </p>
        <p className="text-foreground whitespace-pre-line">
          {addressLines.join('\n')}
        </p>
      </LegalSection>

      <LegalSection heading="Rechtliche Anfragen">
        <p>
          Für rechtliche Anliegen, Beanstandungen oder Hinweise zu Inhalten
          dieser Website:{' '}
          <LegalLink href={`mailto:${entity.legalEmail}`}>
            {entity.legalEmail}
          </LegalLink>
        </p>
      </LegalSection>

      <LegalSection heading="Berufsbezeichnung und Tätigkeit">
        <p>
          Freiberufliche Beratungstätigkeit in den Bereichen Marketing, CRM und
          Analytics. Es besteht keine Zugehörigkeit zu einer Kammer und es
          gelten keine berufsrechtlichen Regelungen im Sinne des § 5 Abs. 1
          Nr. 5 DDG.
        </p>
      </LegalSection>

      <LegalSection heading="Streitschlichtung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung bereit:{' '}
          <LegalLink href="https://ec.europa.eu/consumers/odr/" external>
            ec.europa.eu/consumers/odr
          </LegalLink>
        </p>
        <p>
          Ich bin nicht verpflichtet und nicht bereit, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Inhalte">
        <p>
          Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 DDG bin ich als Diensteanbieter jedoch nicht verpflichtet,
          übermittelte oder gespeicherte fremde Informationen zu überwachen oder
          nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
          hinweisen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
          Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
          entsprechender Rechtsverletzungen werde ich diese Inhalte unverzüglich
          entfernen.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Links">
        <p>
          Diese Website enthält Links zu externen Websites Dritter, auf deren
          Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden
          Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
          Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
          verantwortlich.
        </p>
        <p>
          Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
          Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt
          der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle
          der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
          Rechtsverletzung nicht zumutbar.
        </p>
      </LegalSection>

      <LegalSection heading="Urheberrecht">
        <p>
          Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors bzw. Erstellers.
        </p>
        <p>
          Genannte Marken- und Firmennamen sowie Logos Dritter sind Eigentum der
          jeweiligen Rechteinhaber und werden ausschließlich zur Beschreibung
          durchgeführter Projekte verwendet.
        </p>
      </LegalSection>

      <LegalSection heading="Datenschutz">
        <p>
          Informationen zur Verarbeitung personenbezogener Daten finden Sie in
          der{' '}
          <LegalLink href={legalRoutes.privacy.de}>
            Datenschutzerklärung
          </LegalLink>
          .
        </p>
      </LegalSection>
    </LegalShell>
  )
}
