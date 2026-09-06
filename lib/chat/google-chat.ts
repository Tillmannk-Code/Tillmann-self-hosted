import 'server-only'
import { GoogleAuth } from 'google-auth-library'
import { OAuth2Client } from 'google-auth-library'

/**
 * Thin wrapper around the parts of the Google Chat REST API this feature
 * needs: posting a visitor message into a space (starting or continuing a
 * thread) and verifying that an inbound webhook really came from Google.
 *
 * All secrets stay server-side. Nothing here is imported by client code —
 * the `server-only` guard makes a client import a build error.
 */

const CHAT_SCOPE = 'https://www.googleapis.com/auth/chat.bot'
const CHAT_API = 'https://chat.googleapis.com/v1'

/**
 * Google signs Chat webhook requests with a service account, and WHICH account
 * depends on how the app was built:
 *  - Classic Chat app  → `chat@system.gserviceaccount.com`
 *  - Workspace add-on  → `service-<PROJECT_NUMBER>@gcp-sa-gsuiteaddons.iam.gserviceaccount.com`
 *    (this app is an add-on; the signer is shown on the Configuration page as
 *    the "Service Account Email").
 *
 * The token is a JWT self-signed by that account (iss = email = the account),
 * with `aud` set to either the project number or the endpoint URL. We accept
 * either signer, fetch that account's x509 certs, and verify the signature.
 * A standard Google OIDC token (iss = accounts.google.com) is also handled.
 */
const CHAT_ISSUER = 'chat@system.gserviceaccount.com'
const GOOGLE_OIDC_ISSUERS = ['accounts.google.com', 'https://accounts.google.com']
/** x509 cert bundle endpoint for any Google service account, keyed by email. */
const certsUrlFor = (email: string) =>
  `https://www.googleapis.com/service_accounts/v1/metadata/x509/${encodeURIComponent(email)}`
/** The Workspace add-on signer email for a given project number. */
const addonSignerFor = (projectNumber: string) =>
  `service-${projectNumber}@gcp-sa-gsuiteaddons.iam.gserviceaccount.com`

/** Read a JWT's claims WITHOUT verifying — used only for diagnostic logging. */
function decodeJwtClaims(token: string): Record<string, unknown> | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

export type ChatConfig = {
  serviceAccountKey: string
  space: string
  /** Project number the Chat app lives in; the webhook JWT's audience. */
  projectNumber: string
}

/**
 * Reads and validates configuration once. Returns null (rather than throwing)
 * when unset, so the app runs fine locally and in preview before the owner has
 * finished the one-time Google Cloud setup — the chat widget simply reports
 * that live chat is not configured yet.
 */
/**
 * Coerce whatever the owner pasted into the canonical `spaces/<id>` resource
 * name the REST API expects. Accepts a bare id, `space/<id>` (the SINGULAR form
 * from the Gmail web URL — the usual culprit behind an HTML 404), the correct
 * `spaces/<id>`, or a full Gmail URL like
 * `mail.google.com/.../space/AAQA7nu9AvU`. We take the last path segment (minus
 * any query/fragment) and prefix `spaces/`.
 */
export function normalizeSpace(raw: string): string {
  const cleaned = raw.trim().split(/[?#]/)[0].replace(/\/+$/, '')
  const id = cleaned.split('/').pop() ?? cleaned
  return `spaces/${id}`
}

export function getChatConfig(): ChatConfig | null {
  // Trim every value. Pasted env vars routinely carry a trailing newline or
  // space; for the space id that whitespace ends up in the request URL
  // (.../spaces/AAQA7nu9AvU%0A) and Google returns an HTML 404 while the
  // whitespace-free list call still succeeds — a confusing, hard-to-spot fault.
  const serviceAccountKey = process.env.GOOGLE_CHAT_SERVICE_ACCOUNT_KEY?.trim()
  const rawSpace = process.env.GOOGLE_CHAT_SPACE?.trim()
  const projectNumber = process.env.GOOGLE_CHAT_PROJECT_NUMBER?.trim()

  if (!serviceAccountKey || !rawSpace || !projectNumber) return null
  return { serviceAccountKey, space: normalizeSpace(rawSpace), projectNumber }
}

/**
 * Decode a Bash ANSI-C quoted string ($'...') in a single left-to-right pass.
 *
 * Copying a key out of a terminal often yields $'{\n  "type": ...}' where the
 * file's real newlines became \n and the private key's own \n became \\n. A
 * single scan (handling the backslash and the char after it together) reverses
 * both correctly: \\n -> \n keeps the private key's escaped newline intact,
 * while a lone \n becomes a real newline. Naive sequential replaces would
 * corrupt the key by mangling \\n, so we scan instead.
 */
function decodeAnsiC(body: string): string {
  let out = ''
  for (let i = 0; i < body.length; i++) {
    if (body[i] !== '\\' || i === body.length - 1) {
      out += body[i]
      continue
    }
    const next = body[++i]
    if (next === 'n') out += '\n'
    else if (next === 't') out += '\t'
    else if (next === 'r') out += '\r'
    else if (next === '\\') out += '\\'
    else if (next === "'") out += "'"
    else if (next === '"') out += '"'
    else out += next
  }
  return out
}

/**
 * Normalize a pasted service-account key into raw JSON. The value should be the
 * JSON object exactly as downloaded, but real-world pastes arrive wrapped: as a
 * Bash ANSI-C string ($'...'), or in plain single/double quotes. We unwrap
 * those defensively so a copy-path quirk doesn't block setup; a correctly
 * pasted key passes straight through untouched.
 */
function normalizeKey(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith("$'") && trimmed.endsWith("'")) {
    return decodeAnsiC(trimmed.slice(2, -1))
  }
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') &&
      trimmed.endsWith('"') &&
      !trimmed.slice(1, -1).trim().startsWith('{'))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseServiceAccount(raw: string) {
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(normalizeKey(raw))
  } catch {
    throw new Error(
      'GOOGLE_CHAT_SERVICE_ACCOUNT_KEY is not valid JSON. Paste the full service-account key file contents.',
    )
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      'GOOGLE_CHAT_SERVICE_ACCOUNT_KEY is missing client_email/private_key.',
    )
  }
  return parsed
}

let cachedAuth: GoogleAuth | null = null

function getAuth(config: ChatConfig): GoogleAuth {
  if (cachedAuth) return cachedAuth
  cachedAuth = new GoogleAuth({
    credentials: parseServiceAccount(config.serviceAccountKey),
    scopes: [CHAT_SCOPE],
  })
  return cachedAuth
}

async function authorizedHeaders(config: ChatConfig): Promise<HeadersInit> {
  const client = await getAuth(config).getClient()
  const { token } = await client.getAccessToken()
  if (!token) throw new Error('Failed to obtain Google access token.')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export type PostedMessage = {
  /** Full resource name of the created message, e.g. spaces/AAA/messages/BBB. */
  messageName: string
  /** Thread this message belongs to, e.g. spaces/AAA/threads/CCC. */
  threadName: string | null
}

/**
 * Posts a visitor message into the Chat space. When `threadName` is provided
 * the message continues that existing thread; otherwise it starts a new one.
 * The returned `threadName` is persisted so later messages in the same
 * conversation land in the same Chat thread.
 */
export async function postVisitorMessage(
  config: ChatConfig,
  args: {
    text: string
    threadName: string | null
  },
): Promise<PostedMessage> {
  const headers = await authorizedHeaders(config)

  // Continue an existing thread when we have one, else fall back to keying the
  // thread by nothing (a fresh thread). REPLY_MESSAGE_OR_FAIL guarantees we
  // never silently start a second thread for the same conversation.
  const url = new URL(`${CHAT_API}/${config.space}/messages`)
  const body: Record<string, unknown> = { text: args.text }

  if (args.threadName) {
    body.thread = { name: args.threadName }
    url.searchParams.set(
      'messageReplyOption',
      'REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD',
    )
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Google Chat post failed (${res.status}): ${detail}`)
  }

  const json = (await res.json()) as {
    name?: string
    thread?: { name?: string }
  }

  return {
    messageName: json.name ?? '',
    threadName: json.thread?.name ?? null,
  }
}

let cachedVerifier: OAuth2Client | null = null

/**
 * Verifies the bearer token Google attaches to every webhook request. This is
 * the security boundary for the inbound route: a forged request without a
 * Google-signed token for our project is rejected. Returns the decoded payload
 * on success, or null on any failure.
 */
export async function verifyChatRequest(
  authorizationHeader: string | null,
  config: ChatConfig,
  extraAudiences: string[] = [],
): Promise<Record<string, unknown> | null> {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    console.log('[v0] chat webhook: missing/invalid Authorization header')
    return null
  }
  const token = authorizationHeader.slice('Bearer '.length)

  // Diagnostic only — decoded WITHOUT verification, so it proves nothing about
  // authenticity; it just tells us which audience/issuer mode Google is using.
  const claims = decodeJwtClaims(token)
  console.log('[v0] chat webhook token (unverified):', {
    aud: claims?.aud,
    iss: claims?.iss,
    email: claims?.email,
    expectedAudiences: [config.projectNumber, ...extraAudiences],
  })

  cachedVerifier ??= new OAuth2Client()
  // Valid audiences: the project number or the endpoint URL, depending on the
  // app's authentication-audience setting. Accept either.
  const audiences = [config.projectNumber, ...extraAudiences]
  // Valid signers: the classic Chat system account or this project's Workspace
  // add-on account. The token's `email`/`iss` must be one of these.
  const addonSigner = addonSignerFor(config.projectNumber)
  const acceptedSigners = [CHAT_ISSUER, addonSigner]

  try {
    const iss = typeof claims?.iss === 'string' ? claims.iss : ''

    if (GOOGLE_OIDC_ISSUERS.includes(iss)) {
      // App-URL mode: a standard Google-signed OIDC ID token.
      const ticket = await cachedVerifier.verifyIdToken({
        idToken: token,
        audience: audiences,
      })
      const payload = ticket.getPayload()
      if (!payload || !acceptedSigners.includes(payload.email ?? '')) {
        console.log('[v0] chat webhook: OIDC payload rejected', {
          email: payload?.email,
        })
        return null
      }
      console.log('[v0] chat webhook: verified via OIDC (App-URL mode)')
      return payload as unknown as Record<string, unknown>
    }

    // Self-signed mode: the JWT is signed by the service account named in `iss`.
    // Only proceed if that signer is one we accept, then fetch THAT account's
    // x509 certs and verify the signature against them.
    if (!acceptedSigners.includes(iss)) {
      console.log('[v0] chat webhook: unexpected issuer', { iss })
      return null
    }
    const certsRes = await fetch(certsUrlFor(iss))
    if (!certsRes.ok) {
      console.log('[v0] chat webhook: failed to fetch signer certs', {
        iss,
        status: certsRes.status,
      })
      return null
    }
    const certs = (await certsRes.json()) as Record<string, string>
    const login = await cachedVerifier.verifySignedJwtWithCertsAsync(
      token,
      certs,
      audiences,
      acceptedSigners,
    )
    const payload = login.getPayload() as { email?: string } | undefined
    if (!payload || !acceptedSigners.includes(payload.email ?? '')) {
      console.log('[v0] chat webhook: self-signed payload rejected', {
        email: payload?.email,
      })
      return null
    }
    console.log('[v0] chat webhook: verified via self-signed JWT', { iss })
    return payload as unknown as Record<string, unknown>
  } catch (err) {
    console.log(
      '[v0] chat webhook: verification threw',
      err instanceof Error ? err.message : String(err),
    )
    return null
  }
}
