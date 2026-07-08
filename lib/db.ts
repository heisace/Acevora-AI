import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

// Stub database connection - will be properly configured later
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/studygen',
})

// Stub drizzle instance
export const db = drizzle(pool)
