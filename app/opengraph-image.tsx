import { ImageResponse } from 'next/og'
import { hero, site } from '@/lib/content'
import { OG_COLORS, OG_CONTENT_TYPE, OG_SIZE, OgCard, loadOgFonts } from '@/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = `${site.name} — ${site.tagline}, based in ${site.location}`

/**
 * Read straight off the hero so the share card can never drift out of sync
 * with the wordmark it is meant to echo.
 */
const DISCIPLINES = hero.words

export default async function SiteOgImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrowLeft="tillmann24.com"
        eyebrowRight="Berlin"
        footer="Interim Management · Consulting · Dashboards"
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {DISCIPLINES.map((word, i) => (
            <div
              key={word}
              style={{
                fontSize: 110,
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                // Only the last line takes the accent, so the eye lands on one
                // discipline rather than being pulled three ways at once.
                color: i === DISCIPLINES.length - 1 ? OG_COLORS.ACCENT : OG_COLORS.PAPER,
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </OgCard>
    ),
    { ...size, fonts: await loadOgFonts() },
  )
}
