'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import {
  type Identity,
  type PublicMessage,
  pollMessages,
  readIdentity,
  readToken,
  sendMessage,
  writeIdentity,
  writeToken,
} from '@/lib/chat/client'
import { LIMITS } from '@/lib/chat/limits'
import { site } from '@/lib/content'
import { cn } from '@/lib/utils'

const POLL_OPEN_MS = 4000
const POLL_CLOSED_MS = 25000

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [messages, setMessages] = useState<PublicMessage[]>([])
  const [draft, setDraft] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)
  const [unread, setUnread] = useState(false)
  const [offsetBottom, setOffsetBottom] = useState(24)

  const panelId = useId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const draftRef = useRef<HTMLTextAreaElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  // The timestamp of the newest message we've stored, used as the poll cursor.
  const cursorRef = useRef<string | null>(null)

  const started = token !== null

  // Load any prior conversation on mount.
  useEffect(() => {
    setToken(readToken())
    setIdentity(readIdentity())
  }, [])

  const ingest = useCallback((incoming: PublicMessage[]) => {
    if (incoming.length === 0) return
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id))
      // Pending optimistic echoes (tmp- ids) that haven't been reconciled yet.
      // If the poll returns the server's canonical copy of one of these before
      // submit() has swapped it in, match on sender+body and drop the temp row
      // so the visitor's own message doesn't appear twice.
      const pending = prev.filter(
        (m) => m.id.startsWith('tmp-') && m.sender === 'visitor',
      )
      let merged = [...prev]
      for (const m of incoming) {
        if (seen.has(m.id)) continue
        const dupIdx = pending.findIndex(
          (p) => p.sender === m.sender && p.body === m.body,
        )
        if (dupIdx !== -1) {
          const tmpId = pending[dupIdx].id
          pending.splice(dupIdx, 1)
          merged = merged.filter((x) => x.id !== tmpId)
        }
        merged.push(m)
      }
      merged.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      cursorRef.current = merged[merged.length - 1]?.createdAt ?? null
      return merged
    })
  }, [])

  // Poll for new messages. Faster while open, slow trickle while closed so a
  // reply that arrives when the widget is shut still lights the unread dot.
  useEffect(() => {
    if (!token) return
    let active = true

    const tick = async () => {
      const incoming = await pollMessages(token, cursorRef.current)
      if (!active || incoming.length === 0) return
      const ownerReplies = incoming.some((m) => m.sender === 'owner')
      ingest(incoming)
      if (!open && ownerReplies) setUnread(true)
    }

    void tick()
    const id = window.setInterval(
      tick,
      open ? POLL_OPEN_MS : POLL_CLOSED_MS,
    )
    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [token, open, ingest])

  // Keep the launcher clear of the cookie-consent banner. The consent manager
  // reserves its height as body padding-bottom; we mirror that so the two
  // fixed elements never overlap, and follow it when the banner is dismissed.
  //
  // A ResizeObserver is the wrong tool here: it watches the content box, and a
  // padding change doesn't resize that box, so it would never fire. We watch
  // the body's style attribute directly (plus viewport resize) instead.
  useEffect(() => {
    const read = () => {
      const pad = Number.parseInt(
        getComputedStyle(document.body).paddingBottom || '0',
        10,
      )
      setOffsetBottom((Number.isNaN(pad) ? 0 : pad) + 24)
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    })
    window.addEventListener('resize', read)
    return () => {
      mo.disconnect()
      window.removeEventListener('resize', read)
    }
  }, [])

  // Autoscroll to the newest message whenever the list grows or opens.
  useEffect(() => {
    if (!open) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, open])

  const openPanel = useCallback(() => {
    setOpen(true)
    setUnread(false)
  }, [])

  // Focus the right field when the panel opens, and close on Escape.
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => {
      if (started) draftRef.current?.focus()
      else emailRef.current?.focus()
    }, 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, started])

  async function submit() {
    const message = draft.trim()
    if (!message || sending) return

    if (!started && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())) {
      setError('Please enter a valid email so I can reply.')
      emailRef.current?.focus()
      return
    }

    setSending(true)
    setError(null)

    // Optimistic echo so the visitor's own message appears instantly.
    const optimistic: PublicMessage = {
      id: `tmp-${Date.now()}`,
      sender: 'visitor',
      body: message,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])
    setDraft('')

    const result = await sendMessage({
      token,
      email: started ? undefined : emailInput.trim(),
      name: started ? undefined : nameInput.trim() || undefined,
      message,
    })

    setSending(false)

    if (!result.ok) {
      // Roll back the optimistic message and restore the draft.
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
      setDraft(message)
      setError(result.error)
      setNotConfigured(Boolean(result.notConfigured))
      return
    }

    if (!started) {
      setToken(result.token)
      writeToken(result.token)
      const id: Identity = {
        email: emailInput.trim(),
        name: nameInput.trim() || null,
      }
      setIdentity(id)
      writeIdentity(id)
    }

    // Replace the optimistic row with the server's canonical one. If a poll
    // already ingested that canonical message (its id is present), just drop
    // the optimistic row instead of renaming it — otherwise both would remain.
    setMessages((prev) => {
      const alreadyHasCanonical = prev.some((m) => m.id === result.message.id)
      if (alreadyHasCanonical) {
        return prev.filter((m) => m.id !== optimistic.id)
      }
      return prev.map((m) => (m.id === optimistic.id ? result.message : m))
    })
    cursorRef.current = result.message.createdAt
  }

  function onDraftKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter is a newline. Respect IME composition so
    // confirming a CJK candidate with Enter doesn't fire a send.
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <div
      className="fixed right-6 z-40 flex flex-col items-end"
      style={{ bottom: offsetBottom }}
    >
      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-label="Chat with Tillmann"
          className={cn(
            'bg-surface border-border mb-3 flex w-[calc(100vw-3rem)] max-w-sm flex-col border shadow-2xl',
            // Only reserve the tall conversation height once chatting has
            // begun. Before that the message area is a single intro line, and a
            // fixed 32rem would strand the email form at the bottom behind a
            // large empty void. Let the gate size to its content instead.
            started && 'h-[32rem]',
          )}
          // Cap the height against what's actually free above the launcher.
          // offsetBottom already covers the consent banner + base gap; add the
          // launcher (56px), its 12px mb-3 gap, and a 16px top breathing margin.
          // Without this the panel keeps its full 32rem and pushes the composer
          // off-screen (or behind the banner) on short viewports.
          style={{ maxHeight: `calc(100dvh - ${offsetBottom + 84}px)` }}
        >
          <header className="rule-b flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">
                Chat with Tillmann
              </span>
              <span className="eyebrow text-muted-foreground mt-1">
                Usually replies within a day
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-muted-foreground hover:text-foreground -mr-1 p-1 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
            aria-atomic="false"
          >
            <p className="text-muted-foreground text-sm leading-relaxed">
              {started
                ? 'Ask me anything about growth, CRM or working together.'
                : "Leave your email and a message — I'll get back to you here and by email."}
            </p>

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex flex-col gap-1',
                  m.sender === 'visitor' ? 'items-end' : 'items-start',
                )}
              >
                <span className="eyebrow text-muted-foreground/70">
                  {m.sender === 'visitor' ? 'You' : 'Tillmann'}
                </span>
                <p
                  className={cn(
                    'max-w-[85%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap',
                    m.sender === 'visitor'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground',
                  )}
                >
                  {m.body}
                </p>
              </div>
            ))}
          </div>

          <div className="rule-t flex flex-col gap-2 px-4 py-3">
            {!started && (
              <div className="flex flex-col gap-2">
                <input
                  ref={emailRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  maxLength={LIMITS.email}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Your email (required)"
                  aria-label="Your email"
                  className="bg-background border-input focus:border-ring w-full border px-3 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  autoComplete="name"
                  maxLength={LIMITS.name}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your name (optional)"
                  aria-label="Your name"
                  className="bg-background border-input focus:border-ring w-full border px-3 py-2 text-sm outline-none"
                />
              </div>
            )}

            {error && (
              <p role="alert" className="text-destructive text-xs leading-snug">
                {error}
                {notConfigured && (
                  <>
                    {' '}
                    You can email me directly at{' '}
                    <a href={`mailto:${site.email}`} className="underline">
                      {site.email}
                    </a>
                    .
                  </>
                )}
              </p>
            )}

            <div className="flex items-end gap-2">
              <textarea
                ref={draftRef}
                rows={1}
                value={draft}
                maxLength={LIMITS.message}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onDraftKeyDown}
                placeholder="Write a message…"
                aria-label="Message"
                className="bg-background border-input focus:border-ring max-h-28 min-h-[2.5rem] w-full resize-none border px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => void submit()}
                disabled={sending || draft.trim().length === 0}
                className="bg-accent text-accent-foreground shrink-0 px-3 py-2 text-sm font-bold transition-opacity disabled:opacity-40"
              >
                {sending ? '…' : 'Send'}
              </button>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="bg-accent text-accent-foreground relative flex h-14 w-14 items-center justify-center shadow-2xl transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5h16v10H8l-4 4V5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {unread && !open && (
          <span
            className="bg-background absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <span className="bg-destructive h-2.5 w-2.5 rounded-full" />
          </span>
        )}
      </button>
    </div>
  )
}
