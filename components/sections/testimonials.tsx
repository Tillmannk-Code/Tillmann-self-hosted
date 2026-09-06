'use client'

import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { testimonials } from '@/lib/content'
import { cn } from '@/lib/utils'

/**
 * Slider built on CSS scroll-snap rather than a JS transform carousel:
 * touch swipe, momentum and keyboard scrolling all come from the browser, and
 * every quote stays in the DOM (and readable by assistive tech) at all times.
 *
 * Slides are exactly one container wide with no gap between them, so the
 * active index is simply scrollLeft / slideWidth. Adding a `gap` here would
 * break that maths — put spacing inside the slide instead.
 */
/**
 * Fast enough to feel alive, still long enough to read a short quote. Anything
 * under ~4s turns these two-sentence quotes into a flicker; the pause button
 * and hover-to-hold cover visitors who want longer on one.
 */
const AUTOPLAY_MS = 4500

/**
 * The first card's visible time is really "time to scroll into view" + this
 * timer, so with the full delay it sits noticeably longer than every card
 * after it. A shorter first hop evens out that perceived dwell.
 */
const FIRST_AUTOPLAY_MS = 2500

export function Testimonials() {
  const quoted = testimonials.filter((t) => t.quote)
  const trackRef = useRef<HTMLUListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // Autoplay is opt-out by the visitor (pause button) and opt-out by their OS
  // (prefers-reduced-motion), so it starts false and is enabled after mount
  // once we can read the media query.
  const [autoplay, setAutoplay] = useState(false)
  // Transient reasons to hold the timer without clearing the visitor's intent.
  const [hovering, setHovering] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [offscreen, setOffscreen] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)

  const total = quoted.length
  const atStart = active === 0
  const atEnd = active === total - 1

  // Once the first auto-advance has fired, every later hop uses the full delay.
  const hasAutoAdvancedRef = useRef(false)

  // Derive the active slide from real scroll position, so swipes, arrow-key
  // scrolls and button clicks all stay in sync with one source of truth.
  const syncActive = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const slideWidth = track.clientWidth
    if (slideWidth === 0) return
    const index = Math.round(track.scrollLeft / slideWidth)
    setActive(Math.max(0, Math.min(total - 1, index)))
  }, [total])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    // Re-derive on resize: slideWidth changes, so the old index maths is stale.
    const observer = new ResizeObserver(syncActive)
    observer.observe(track)
    return () => observer.disconnect()
  }, [syncActive])

  const goTo = useCallback((index: number, options?: { jump?: boolean }) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(track.children.length - 1, index))
    // Respect reduced-motion: a long smooth scroll is exactly the kind of
    // movement those users opted out of.
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    track.scrollTo({
      left: clamped * track.clientWidth,
      // `jump` is for the autoplay wrap from last back to first: smooth-scrolling
      // that distance blurs past every quote in between, which reads as a glitch.
      behavior: prefersReduced || options?.jump ? 'auto' : 'smooth',
    })
  }, [])

  /**
   * An explicit control (arrow, dot, keyboard, swipe) means the visitor is
   * driving now, so autoplay stops for good rather than yanking the slide away
   * mid-read. The pause/play button is how they hand control back.
   */
  const takeControl = useCallback(() => setAutoplay(false), [])

  // Enable autoplay unless the OS asks for reduced motion, and keep following
  // that preference if it changes while the page is open.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setAutoplay(!query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  // Don't rotate a section nobody is looking at: without this the visitor
  // scrolls back up to find the carousel has wandered to a different quote.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  // Same reasoning for a backgrounded tab.
  useEffect(() => {
    const sync = () => setTabHidden(document.hidden)
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  const rotating =
    autoplay && !hovering && !focusWithin && !offscreen && !tabHidden && total > 1

  // A timeout keyed on `active` rather than a bare interval, so every slide —
  // including one the visitor just swiped to — gets a full reading window.
  useEffect(() => {
    if (!rotating) return
    const delay = hasAutoAdvancedRef.current ? AUTOPLAY_MS : FIRST_AUTOPLAY_MS
    const id = window.setTimeout(() => {
      hasAutoAdvancedRef.current = true
      const next = active + 1
      if (next >= total) goTo(0, { jump: true })
      else goTo(next)
    }, delay)
    return () => window.clearTimeout(id)
  }, [rotating, active, total, goTo])

  return (
    <section className="bg-surface rule-t rule-b py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading number="07" label="What do people say about me" />

        <div
          ref={rootRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client and colleague testimonials"
          // Hovering or tabbing into the carousel holds the timer, so a quote
          // can't slide away while it is being read or a control aimed at.
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          onFocusCapture={() => setFocusWithin(true)}
          onBlurCapture={() => setFocusWithin(false)}
          className="flex flex-col gap-8"
        >
          <ul
            ref={trackRef}
            onScroll={syncActive}
            tabIndex={0}
            aria-label={`Testimonials, ${total} total`}
            // While slides advance on their own, announcing each one would talk
            // over the screen-reader user; once stopped, their own moves should
            // be announced. This is the APG auto-rotating carousel behaviour.
            aria-live={rotating ? 'off' : 'polite'}
            // A swipe is the visitor taking over. onScroll can't be used for
            // this — autoplay's own programmatic scrolling fires it too.
            onPointerDown={takeControl}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault()
                takeControl()
                goTo(active + 1)
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault()
                takeControl()
                goTo(active - 1)
              }
            }}
            className={cn(
              'flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain',
              'focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-4',
              // Hide the native scrollbar; the dots and arrows are the affordance.
              '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            )}
          >
            {quoted.map((t, index) => (
              <li
                key={t.name}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}`}
                // w-full (not min-w-full) pins the slide to exactly the track
                // width. With min-w-full the inner max-w-4xl figure could push
                // the slide wider, clipping text and breaking the index maths.
                // Every slide is as tall as the longest quote (that's what
                // stops the height jumping between slides), so short quotes are
                // centred rather than left with a void beneath them.
                className="flex w-full shrink-0 snap-start flex-col justify-center"
              >
                <figure className="flex max-w-4xl flex-col gap-8 pr-6 md:pr-12">
                  <blockquote
                    lang={t.lang}
                    className="text-[clamp(1.125rem,2.3vw,1.75rem)] leading-[1.4] font-medium tracking-tight text-pretty"
                  >
                    <span aria-hidden className="text-accent mr-1">
                      “
                    </span>
                    {t.quote}
                    <span aria-hidden className="text-accent">
                      ”
                    </span>
                  </blockquote>
                  <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span aria-hidden className="bg-accent h-[2px] w-10" />
                    <span className="font-bold tracking-tight">{t.name}</span>
                    {t.title || t.location ? (
                      <span className="eyebrow text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
                        {t.title ? <span>{t.title}</span> : null}
                        {/*
                          Job titles contain their own "|" pipes, so without a
                          delimiter the location reads as another title segment.
                          Only shown when there is a title to separate it from.
                        */}
                        {t.title && t.location ? (
                          <span aria-hidden className="text-accent">
                            ·
                          </span>
                        ) : null}
                        {t.location ? (
                          <span className="text-muted-foreground/60">
                            {t.location}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          {/* Controls: dots on the left, counter + arrows on the right. */}
          <div className="rule-t flex items-center justify-between gap-6 pt-6">
            <ul className="flex items-center gap-2">
              {quoted.map((t, index) => (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => {
                      takeControl()
                      goTo(index)
                    }}
                    aria-label={`Go to testimonial ${index + 1}: ${t.name}`}
                    aria-current={index === active}
                    className={cn(
                      'focus-visible:outline-accent h-2 w-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                      index === active
                        ? 'bg-accent'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/60',
                    )}
                  />
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-5">
              {/*
                WCAG 2.2.2: content that moves on its own for more than five
                seconds needs an explicit way to stop it — hover-to-pause alone
                doesn't count, and isn't reachable by keyboard or touch.
                Icon tracks `autoplay` (the visitor's intent), not `rotating`,
                which is transiently false whenever the pointer is over the
                carousel — including while they're aiming at this button.
              */}
              {total > 1 ? (
                <button
                  type="button"
                  onClick={() => setAutoplay((on) => !on)}
                  aria-label={
                    autoplay
                      ? 'Pause automatic testimonial rotation'
                      : 'Resume automatic testimonial rotation'
                  }
                  aria-pressed={autoplay}
                  className="border-border hover:border-accent hover:text-accent focus-visible:outline-accent text-muted-foreground flex size-11 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {autoplay ? (
                    <Pause className="size-3.5" aria-hidden />
                  ) : (
                    <Play className="size-3.5" aria-hidden />
                  )}
                </button>
              ) : null}
              <p className="eyebrow text-muted-foreground tabular-nums">
                <span className="text-foreground">
                  {String(active + 1).padStart(2, '0')}
                </span>
                {' / '}
                {String(total).padStart(2, '0')}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    takeControl()
                    goTo(active - 1)
                  }}
                  disabled={atStart}
                  aria-label="Previous testimonial"
                  className="border-border hover:border-accent hover:text-accent focus-visible:outline-accent flex size-11 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    takeControl()
                    goTo(active + 1)
                  }}
                  disabled={atEnd}
                  aria-label="Next testimonial"
                  className="border-border hover:border-accent hover:text-accent focus-visible:outline-accent flex size-11 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
