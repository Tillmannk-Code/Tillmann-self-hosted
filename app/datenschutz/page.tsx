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
  title: 'Datenschutzerklärung',
  description:
    'Datenschutzerklärung für tillmann24.com — Verantwortlicher, Hosting, Reichweitenmessung, Google Analytics und Ihre Rechte nach DSGVO.',
  alternates: {
    canonical: legalRoutes.privacy.de,
    languages: {
      de: legalRoutes.privacy.de,
      en: legalRoutes.privacy.en,
    },
  },
  robots: { index: true, follow: true, 'max-snippet': 0 },
}

export default function DatenschutzPage() {
  return (
    <LegalShell
      eyebrow="Rechtliches"
      title="Datenschutz"
      intro="Diese Erklärung informiert darüber, welche personenbezogenen Daten beim Besuch dieser Website verarbeitet werden, auf welcher Rechtsgrundlage das geschieht und welche Rechte Ihnen zustehen."
      lastUpdated={`Stand: ${formatLegalDate(legalLastUpdated, 'de')}`}
      altHref={legalRoutes.privacy.en}
      altLabel="English"
    >
      <LegalSection id="verantwortlicher" heading="1. Verantwortlicher">
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne
          des Art. 4 Nr. 7 DSGVO ist:
        </p>
        <LegalFacts
          items={[
            {
              term: 'Verantwortlicher',
              value: (
                <span className="whitespace-pre-line">
                  {addressLines.join('\n')}
                  {'\n'}
                  {entity.countryDe}
                </span>
              ),
            },
            {
              term: 'E-Mail',
              value: (
                <LegalLink href={`mailto:${entity.legalEmail}`}>
                  {entity.legalEmail}
                </LegalLink>
              ),
            },
          ]}
        />
        <p className="text-muted-foreground/70 text-sm leading-relaxed">
          Ein Datenschutzbeauftragter ist nicht bestellt, da die
          Voraussetzungen des § 38 BDSG nicht erfüllt sind.
        </p>
      </LegalSection>

      <LegalSection id="grundsaetze" heading="2. Grundsätze">
        <p>
          Diese Website ist bewusst datensparsam aufgebaut. Es gibt keine
          Benutzerkonten, kein Kontaktformular, keinen Newsletter und keine
          Werbenetzwerke. Cookies werden ausschließlich für die
          Reichweitenmessung mit Google Analytics gesetzt — und nur dann, wenn
          Sie vorher ausdrücklich zugestimmt haben.
        </p>
      </LegalSection>

      <LegalSection id="hosting" heading="3. Hosting und Server-Logfiles">
        <p>
          Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
          91789, USA gehostet. Beim Aufruf einer Seite verarbeitet Vercel als
          Auftragsverarbeiter technisch notwendige Verbindungsdaten:
        </p>
        <LegalList
          items={[
            'IP-Adresse des anfragenden Geräts',
            'Datum und Uhrzeit des Zugriffs',
            'aufgerufene URL und übertragene Datenmenge',
            'HTTP-Statuscode und Referrer-URL',
            'verwendeter Browser und Betriebssystem',
          ]}
        />
        <p>
          Diese Daten sind für den Betrieb und die Sicherheit der Website
          technisch erforderlich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
          DSGVO; das berechtigte Interesse liegt in der stabilen und sicheren
          Bereitstellung der Website. Mit Vercel besteht ein Vertrag zur
          Auftragsverarbeitung gemäß Art. 28 DSGVO.
        </p>
        <p>
          Da Vercel seinen Sitz in den USA hat, kann eine Übermittlung in ein
          Drittland stattfinden. Vercel ist unter dem EU-U.S. Data Privacy
          Framework zertifiziert; zusätzlich werden
          EU-Standardvertragsklauseln verwendet. Weitere Informationen:{' '}
          <LegalLink href="https://vercel.com/legal/privacy-policy" external>
            vercel.com/legal/privacy-policy
          </LegalLink>
        </p>
      </LegalSection>

      <LegalSection id="reichweitenmessung" heading="4. Reichweitenmessung">
        <LegalSubheading>Vercel Analytics (ohne Cookies)</LegalSubheading>
        <p>
          Zur Messung der Seitenaufrufe wird Vercel Analytics eingesetzt. Dieser
          Dienst arbeitet cookiefrei und ohne geräteübergreifende
          Wiedererkennung. Es werden aggregierte Kennzahlen wie aufgerufene
          Seite, Referrer, Gerätetyp und Land erhoben; die IP-Adresse wird
          dabei nicht gespeichert, sondern lediglich transient zur Ableitung
          eines anonymen Kennwerts verwendet.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Da kein Zugriff auf
          Informationen im Endgerät erfolgt, ist keine Einwilligung nach § 25
          TDDDG erforderlich.
        </p>

        <LegalSubheading>Google Analytics 4 (nur mit Einwilligung)</LegalSubheading>
        <p>
          Sofern Sie zugestimmt haben, wird Google Analytics 4 eingesetzt,
          betrieben von Google Ireland Limited, Gordon House, Barrow Street,
          Dublin 4, Irland. Google Analytics verwendet Cookies, die eine
          Analyse der Nutzung dieser Website ermöglichen. Erhoben werden dabei
          insbesondere:
        </p>
        <LegalList
          items={[
            'aufgerufene Seiten, Verweildauer und Interaktionen',
            'gekürzte IP-Adresse (IP-Anonymisierung ist aktiviert)',
            'Referrer, Gerätetyp, Browser und Betriebssystem',
            'ungefährer Standort auf Länder- bzw. Stadtebene',
          ]}
        />
        <p>
          <strong className="text-foreground">Rechtsgrundlage</strong> ist Ihre
          Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit § 25
          Abs. 1 TDDDG. Ohne Ihre Einwilligung wird das Google-Analytics-Skript
          nicht geladen und es werden keine Cookies gesetzt. Es wird zusätzlich
          der Google Consent Mode v2 eingesetzt, der alle Einwilligungsarten
          standardmäßig auf „denied“ setzt.
        </p>
        <p>
          <strong className="text-foreground">Widerruf:</strong> Sie können Ihre
          Einwilligung jederzeit über den Link „Cookie-Einstellungen“ im
          Seitenfuß widerrufen. Bei einem Widerruf werden die bereits gesetzten
          Google-Analytics-Cookies gelöscht und es findet keine weitere
          Verarbeitung statt. Der Widerruf berührt nicht die Rechtmäßigkeit der
          bis dahin erfolgten Verarbeitung.
        </p>
        <p>
          <strong className="text-foreground">Drittlandübermittlung:</strong> Es
          kann eine Übermittlung von Daten an die Google LLC in den USA
          erfolgen. Google LLC ist unter dem EU-U.S. Data Privacy Framework
          zertifiziert. Ergänzend bestehen EU-Standardvertragsklauseln. Es kann
          nicht ausgeschlossen werden, dass US-Behörden auf diese Daten
          zugreifen.
        </p>
        <p>
          <strong className="text-foreground">Speicherdauer:</strong> Die in
          Google Analytics erhobenen Nutzungsdaten werden nach 14 Monaten
          automatisch gelöscht. Cookies von Google Analytics haben eine Laufzeit
          von bis zu 24 Monaten.
        </p>
        <p>
          Mit Google besteht ein Vertrag zur Auftragsverarbeitung. Weitere
          Informationen:{' '}
          <LegalLink
            href="https://policies.google.com/privacy"
            external
          >
            policies.google.com/privacy
          </LegalLink>
        </p>
      </LegalSection>

      <LegalSection id="cookies" heading="5. Cookies im Einzelnen">
        <p>
          Es werden keine technisch notwendigen Cookies gesetzt. Ihre
          Einwilligungsentscheidung selbst wird nicht in einem Cookie, sondern
          im lokalen Speicher Ihres Browsers (<code className="font-mono text-sm">localStorage</code>)
          gespeichert, damit die Auswahl bei einem erneuten Besuch erhalten
          bleibt. Diese Information verlässt Ihr Gerät nicht.
        </p>
        <LegalFacts
          items={[
            {
              term: '_ga, _ga_*',
              value:
                'Google Analytics — Unterscheidung von Besuchern und Sitzungen. Laufzeit bis 24 Monate. Nur mit Einwilligung.',
            },
            {
              term: 'tk-analytics-consent',
              value:
                'localStorage-Eintrag, kein Cookie — speichert Ihre Einwilligungsentscheidung. Kein Ablaufdatum, jederzeit widerrufbar.',
            },
          ]}
        />
      </LegalSection>

      <LegalSection id="schriften" heading="6. Schriftarten und externe Inhalte">
        <p>
          Die verwendeten Schriftarten (Geist und JetBrains Mono) werden
          beim Erstellen der Seiten heruntergeladen und vom eigenen Server
          ausgeliefert. Beim Seitenaufruf findet daher keine Verbindung zu
          Google Fonts statt und es werden keine Daten an Google übermittelt.
        </p>
        <p>
          Diese Website bindet keine externen Videos, Karten, Social-Media-Plugins
          oder Werbenetzwerke ein.
        </p>
      </LegalSection>

      <LegalSection id="kontakt" heading="7. Kontaktaufnahme per E-Mail">
        <p>
          Wenn Sie mich per E-Mail kontaktieren, werden die übermittelten Daten
          (Name, E-Mail-Adresse, Inhalt der Nachricht) zur Bearbeitung Ihrer
          Anfrage verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
          bei vertragsbezogenen Anfragen, ansonsten Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <p>
          Die Daten werden gelöscht, sobald die Anfrage abschließend bearbeitet
          ist und keine gesetzlichen Aufbewahrungspflichten — insbesondere aus
          Handels- und Steuerrecht — entgegenstehen.
        </p>
      </LegalSection>

      <LegalSection id="rechte" heading="8. Ihre Rechte">
        <p>Ihnen stehen gegenüber dem Verantwortlichen folgende Rechte zu:</p>
        <LegalList
          items={[
            <>
              <strong className="text-foreground">Auskunft</strong> über die zu
              Ihrer Person verarbeiteten Daten (Art. 15 DSGVO)
            </>,
            <>
              <strong className="text-foreground">Berichtigung</strong>
              {' '}unrichtiger Daten (Art. 16 DSGVO)
            </>,
            <>
              <strong className="text-foreground">Löschung</strong> Ihrer Daten
              (Art. 17 DSGVO)
            </>,
            <>
              <strong className="text-foreground">
                Einschränkung der Verarbeitung
              </strong>{' '}
              (Art. 18 DSGVO)
            </>,
            <>
              <strong className="text-foreground">Datenübertragbarkeit</strong>
              {' '}(Art. 20 DSGVO)
            </>,
            <>
              <strong className="text-foreground">Widerspruch</strong> gegen
              Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21
              DSGVO)
            </>,
            <>
              <strong className="text-foreground">Widerruf</strong> einer
              erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3
              DSGVO)
            </>,
          ]}
        />
        <p>
          Zur Ausübung dieser Rechte genügt eine Nachricht an{' '}
          <LegalLink href={`mailto:${entity.legalEmail}`}>
            {entity.legalEmail}
          </LegalLink>
          .
        </p>
      </LegalSection>

      <LegalSection id="beschwerde" heading="9. Beschwerderecht">
        <p>
          Unabhängig davon steht Ihnen das Recht zu, sich bei einer
          Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständig
          ist die Behörde des Bundeslandes des Verantwortlichen:
        </p>
        <p className="text-foreground whitespace-pre-line">
          {[
            'Berliner Beauftragte für Datenschutz und Informationsfreiheit',
            'Alt-Moabit 59-61',
            '10555 Berlin',
          ].join('\n')}
        </p>
        <p>
          <LegalLink href="https://www.datenschutz-berlin.de" external>
            datenschutz-berlin.de
          </LegalLink>
        </p>
      </LegalSection>

      <LegalSection id="aenderungen" heading="10. Änderungen dieser Erklärung">
        <p>
          Diese Datenschutzerklärung wird angepasst, wenn sich die
          Datenverarbeitung auf dieser Website ändert oder eine geänderte
          Rechtslage dies erfordert. Es gilt jeweils die hier abrufbare
          Fassung.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
