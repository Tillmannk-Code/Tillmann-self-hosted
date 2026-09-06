import { ImageResponse } from 'next/og'

import { OG_COLORS, loadOgFonts } from '@/lib/og'

// iOS home-screen icons must be raster, so this renders the same TK monogram as
// app/icon.svg to PNG. Both now use real Geist Bold letterforms — the
// hero typeface — rather than hand-drawn bars.

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * Sized so the monogram's ink box is 75% of the tile width, matching the
 * 48-of-64 units used in app/icon.svg.
 */
const FONT_SIZE = 117.8

export default async function AppleIcon() {
  const fonts = await loadOgFonts()

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: OG_COLORS.ACCENT,
          fontFamily: 'Geist',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: FONT_SIZE,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: OG_COLORS.INK,
            // Nudges the optical centre: letterSpacing adds trailing space
            // after the K that would otherwise push the pair left of centre.
            paddingLeft: FONT_SIZE * 0.04,
          }}
        >
          TK
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
