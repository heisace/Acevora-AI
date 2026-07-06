# StudyGen AI - Quick Start Guide

Get StudyGen AI running locally in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- pnpm, npm, or yarn package manager
- PostgreSQL database (Neon recommended for quick setup)
- API keys for: OpenAI, Stripe

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/studygen-ai.git
cd studygen-ai
```

### 2. Install Dependencies

```bash
pnpm install
# or: npm install
# or: yarn install
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit and fill in your credentials
nano .env.local
# or use your favorite editor
```

**Required environment variables:**

```bash
# Database (get from Neon)
DATABASE_URL=postgresql://user:password@host/dbname

# Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-generated-secret-here

# OpenAI API Key (get from platform.openai.com)
OPENAI_API_KEY=sk-...

# Stripe Keys (get from dashboard.stripe.com)
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...

# Vercel Blob Token (optional, for file storage)
BLOB_READ_WRITE_TOKEN=...
```

### 4. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### 5. Create Test Account

1. Visit `http://localhost:3000`
2. Click "Get Started"
3. Fill in sign-up form
4. You're in!

## Using the App

### Upload Your First Document

1. Go to Dashboard
2. Click "Upload Document"
3. Select a PDF file
4. Add title and description
5. Click "Upload Document"

### Generate AI Content

On the document detail page:
- Click "Generate Summary" to create a summary
- Click "Generate Flashcards" to create study cards
- Click "Generate Quiz" to create a quiz

### Test Stripe Integration

1. Go to Pricing page
2. Click "Subscribe to Pro"
3. Use test card: `4242 4242 4242 4242`
4. Any future expiry date and any CVC
5. Click Pay

## Testing

Run the test suite:

```bash
pnpm test
```

Run tests with UI:

```bash
pnpm test:ui
```

## Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure Quick Reference

```
studygen-ai/
├── app/                 # Next.js app routes
├── components/          # React components
├── lib/                 # Utilities and config
│   ├── auth.ts         # Authentication setup
│   ├── db/             # Database & schema
│   └── utils.ts        # Helper functions
├── __tests__/          # Test files
├── public/             # Static assets
├── .env.example        # Environment template
└── README.md           # Full documentation
```

## Common Tasks

### Create a New Page

```bash
# Create: app/new-feature/page.tsx
cat > app/new-feature/page.tsx << 'EOF'
'use client'

export default function NewFeaturePage() {
  return <main>Your page here</main>
}
EOF
```

### Add a Database Table

1. Update `lib/db/schema.ts` with new table
2. Create table via Neon console or SQL script
3. Use in server actions via Drizzle

### Create a Server Action

```typescript
// app/actions/my-action.ts
'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function myAction(data: string) {
  const userId = await getUserId()
  // Your logic here
}
```

## Troubleshooting

### Database Connection Error

```
Error: Failed to connect to Neon
```

**Solution:**
- Verify `DATABASE_URL` in `.env.local`
- Check Neon dashboard for connection issues
- Ensure IP is whitelisted (if applicable)

### OpenAI API Error

```
Error: Invalid API key
```

**Solution:**
- Verify `OPENAI_API_KEY` is correct
- Check OpenAI dashboard for usage limits
- Ensure API key has necessary permissions

### File Upload Not Working

```
Error: Failed to upload file
```

**Solution:**
- Ensure `BLOB_READ_WRITE_TOKEN` is set (if using Blob)
- Check file is PDF format and < 50MB
- Review upload API logs

### Session Cookie Not Working

```
User stays logged out after login
```

**Solution:**
- Verify `BETTER_AUTH_SECRET` is set
- Check browser accepts cookies
- Ensure HTTPS in production
- Clear browser cookies and retry

## Getting Help

### Documentation
- [README.md](./README.md) - Full feature documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture

### Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle Docs](https://orm.drizzle.team/)
- [Better Auth Docs](https://www.better-auth.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Community
- GitHub Issues: Report bugs
- Discussions: Ask questions
- Discord: Real-time chat

## Next Steps

### Development
1. Explore codebase structure
2. Read ARCHITECTURE.md for design patterns
3. Check existing components and actions
4. Build new features following patterns

### Before Going Live
1. Review DEPLOYMENT.md
2. Set up production database
3. Configure Stripe production keys
4. Set up monitoring (Sentry recommended)
5. Add custom domain
6. Configure SSL certificate

### Post-Launch
1. Monitor error logs regularly
2. Review analytics
3. Gather user feedback
4. Plan feature updates
5. Optimize performance based on metrics

## Development Tips

### Hot Reload
- Changes to `.tsx` files auto-reload
- Server action changes require refresh
- Environment variable changes require restart

### Database Inspection
```bash
# Connect to your Neon database
psql $DATABASE_URL

# List tables
\dt

# Describe table
\d table_name

# Run query
SELECT * FROM document LIMIT 5;
```

### Debugging
- Use `console.log("[v0] ...")` for debugging
- Check browser DevTools (F12)
- Review server logs in terminal
- Check Vercel/Railway logs in production

### Performance
- Use `pnpm run build` to test production build
- Check performance with Lighthouse
- Monitor API response times
- Profile database queries

## Version Control

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add my feature"

# Push and create PR
git push origin feature/my-feature
```

### .gitignore
The project includes `.gitignore` covering:
- node_modules
- .next
- .env.local
- .vercel
- .DS_Store

## Support & License

- **License**: MIT
- **Issues**: GitHub Issues
- **Email**: support@studygenai.com
- **Documentation**: See README.md and ARCHITECTURE.md

Enjoy building with StudyGen AI! 🚀
