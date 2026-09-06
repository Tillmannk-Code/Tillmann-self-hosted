import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * HTTP (fetch-based) Neon driver, not a TCP Pool. This feature has no
 * persistent connections to manage and runs entirely from short-lived route
 * handlers, so the serverless HTTP driver is the right fit — there is no
 * Better Auth here that would require a shared `pg` Pool.
 */
const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })
