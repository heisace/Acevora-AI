import { betterAuth } from 'better-auth'

// Stub auth - will be properly configured with database and environment variables
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || 'development-secret-key-change-in-production',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
})
