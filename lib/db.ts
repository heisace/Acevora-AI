import { Pool } from 'pg'

// Stub database connection - will be properly configured later
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/studygen',
})
