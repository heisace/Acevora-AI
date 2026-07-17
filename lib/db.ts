/**
 * Single source of truth for the database client.
 * Re-exports from ./db/index so every import of `@/lib/db` gets the
 * schema-aware Drizzle instance.
 */
export { db, pool } from './db/index'
