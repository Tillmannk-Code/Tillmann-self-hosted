import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { ReactElement } from 'react'

/**
 * Shared building blocks for the generated Open Graph cards.
 *
 * Fonts are vendored in `assets/fonts` rather than fetched from Google at
 * build time: Satori cannot read woff2, and a network fetch would make the
 * build non-deterministic and fail offline.
 *
 * Server-only by nature (reads from disk) — import from metadata image routes
 * only, never from a component that ships to the browser.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/** Mirrors the design tokens in app/globals.css. */
const INK = '#08090a'
const PAPER = '#f2f4f3'
const ACCENT = '#ff412e'
const MUTED = '#8a9299'
const HAIRLINE = 'rgba(242, 244, 243, 0.14)'

export async function loadOgFonts() {
  const dir = join(process.cwd(), 'assets', 'fonts')
  const [display, mono] = await Promise.all([
    readFile(join(dir, 'Geist-Bold.ttf')),
    readFile(join(dir, 'JetBrainsMono-Regular.ttf')),
  ])

  return [
    { name: 'Geist', data: display, weight: 700 as const },
    { name: 'JetBrains Mono', data: mono, weight: 400 as const },
  ]
}

/**
 * The TK monogram in real Geist Bold, matching app/icon.svg. The font
 * is already loaded for these cards, so the mark uses genuine letterforms
 * rather than the hand-drawn bars this used to approximate them with.
 */
function Monogram({ size }: { size: number }) {
  // 0.654 puts the ink box at 75% of the tile width — the same 48-of-64 units
  // the favicon uses, so the two marks stay identical at any scale.
  const fontSize = size * 0.654

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        background: ACCENT,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          color: INK,
          // Offsets the trailing letter-space after the K, which would
          // otherwise pull the pair left of true centre.
          paddingLeft: fontSize * 0.04,
        }}
      >
        TK
      </div>
    </div>
  )
}

const eyebrowStyle = {
  fontFamily: 'JetBrains Mono',
  fontSize: 22,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: MUTED,
}

/**
 * Card shell: eyebrow row up top, caller-supplied body, signature row below a
 * hairline. Keeps every card on the same grid so a shared post and the site
 * card read as the same brand.
 */
export function OgCard({
  eyebrowLeft,
  eyebrowRight,
  children,
  footer,
}: {
  eyebrowLeft: string
  eyebrowRight?: string
  children: ReactElement
  footer: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: INK,
        color: PAPER,
        padding: 72,
        fontFamily: 'Geist',
      }}
    >
      {/* A single red hairline along the very top edge — the one flash of
          accent that survives being scaled down to a thumbnail. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 8,
          background: ACCENT,
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={eyebrowStyle}>{eyebrowLeft}</div>
        {eyebrowRight ? (
          <div style={{ ...eyebrowStyle, color: ACCENT }}>{eyebrowRight}</div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {children}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: 28,
        }}
      >
        <Monogram size={56} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
            Tillmann Kühn
          </div>
          <div style={{ ...eyebrowStyle, fontSize: 18 }}>{footer}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Display type scaled to the title length so long headlines stay inside the
 * card instead of overflowing or being clipped mid-word.
 */
export function displaySize(text: string) {
  if (text.length <= 28) return 96
  if (text.length <= 44) return 80
  if (text.length <= 64) return 66
  return 54
}

export const OG_COLORS = { INK, PAPER, ACCENT, MUTED, HAIRLINE }
