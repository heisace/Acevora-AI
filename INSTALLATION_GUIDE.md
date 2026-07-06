# StudyGen AI - Installation & First Run Guide

## Quick Install (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (use Neon for free)
- API keys: OpenAI, Stripe

### Step 1: Extract Project (2 min)
```bash
# Extract the downloaded zip file
unzip studygen-ai-v1.0.0.zip
cd studygen-ai
```

### Step 2: Install Dependencies (2 min)
```bash
pnpm install
# Or: npm install, yarn install
```

### Step 3: Configure Environment (1 min)
```bash
# Copy example configuration
cp .env.example .env.local

# Edit with your API keys
nano .env.local  # or use your editor
```

**Required Keys:**
- `DATABASE_URL` - from Neon
- `BETTER_AUTH_SECRET` - generate: `openssl rand -base64 32`
- `OPENAI_API_KEY` - from OpenAI dashboard
- `STRIPE_PUBLIC_KEY` & `STRIPE_SECRET_KEY` - from Stripe

### Step 4: Run Locally (no waiting)
```bash
pnpm dev
# Open: http://localhost:3000
```

## First Test Run

### 1. Create Account (30 seconds)
1. Click "Get Started"
2. Enter email and password
3. ✅ You're logged in!

### 2. Upload a PDF (1 minute)
1. Go to Dashboard → Upload Document
2. Select a PDF file (any topic)
3. Add title: "Test Document"
4. Click Upload
5. ✅ Document appears in dashboard

### 3. Generate AI Content (1 minute)
1. Click your document
2. Click "Generate Summary" → Select "Medium"
3. Wait 2-3 seconds for AI response
4. ✅ Summary appears!

Try flashcards and quizzes too!

### 4. Test Payments (2 minutes)
1. Click "Pricing"
2. Select "Pro Plan"
3. Click "Subscribe Now"
4. Use test card: `4242 4242 4242 4242`
5. Any future date, any CVC
6. ✅ Payment processed!

## Project Structure at a Glance

```
Your App
├── 🏠 Home Page (landing)
├── 🔐 Authentication (sign-in/up)
├── 📊 Dashboard (documents)
├── 📄 Upload Page (PDF files)
├── 📚 Document Detail (AI tools)
├── 💰 Pricing Page (subscriptions)
├── 👨‍💼 Admin Dashboard (analytics)
└── 🧠 AI Features
    ├── Summaries
    ├── Flashcards
    └── Quizzes
```

## Key Files Explained

### Your Code
- `app/page.tsx` - Home page (edit this first!)
- `app/dashboard/` - Main app (after login)
- `components/` - React components
- `lib/db/schema.ts` - Database tables

### Configuration
- `.env.local` - Your API keys (DON'T commit!)
- `package.json` - Dependencies and scripts
- `next.config.mjs` - Next.js settings

### Documentation
- `README.md` - Features & setup
- `SETUP.md` - Detailed quick start
- `DEPLOYMENT.md` - Go live guide
- `ARCHITECTURE.md` - How it works

## Common Commands

```bash
# Development
pnpm dev              # Run locally
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run tests
pnpm test:ui          # Tests with UI

# Maintenance
pnpm lint             # Check code
pnpm package          # Package for distribution
```

## Customization Starter Kit

### Change Branding
```typescript
// app/layout.tsx
title: 'Your App Name'
description: 'Your description'

// app/page.tsx
<h1>Your Title</h1>
<p>Your copy here</p>
```

### Change Colors
```typescript
// globals.css
@theme {
  --color-primary: #your-color;
}
```

### Add New Page
```bash
# Create: app/new-feature/page.tsx
cat > app/new-feature/page.tsx << 'EOF'
'use client'

export default function NewPage() {
  return <main>Your page</main>
}
EOF
```

## Troubleshooting

### "Port 3000 already in use"
```bash
pnpm dev --port 3001
```

### "Database connection error"
- Check DATABASE_URL in .env.local
- Verify connection string is valid
- Test: `psql $DATABASE_URL -c "SELECT 1"`

### "OpenAI API error"
- Verify OPENAI_API_KEY is set
- Check OpenAI dashboard for usage limits
- Test: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

### "File upload not working"
- Ensure BLOB_READ_WRITE_TOKEN is set
- Check file is PDF and < 50MB
- Review upload API logs

## Environment Variables Explained

```bash
# Database Connection (required)
DATABASE_URL=postgresql://user:pass@host/dbname
  # Get from: https://console.neon.tech

# Authentication Secret (required)
BETTER_AUTH_SECRET=your-32-char-random-string
  # Generate: openssl rand -base64 32

# AI Service (required for AI features)
OPENAI_API_KEY=sk-your-api-key
  # Get from: https://platform.openai.com/api-keys

# Payment Processing (required for billing)
STRIPE_PUBLIC_KEY=pk_...        # Publishable
STRIPE_SECRET_KEY=sk_...        # Secret
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook

# Price IDs for subscription tiers
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# File Storage (required for PDF upload)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
  # Get from: https://vercel.com/dashboard/stores
```

## Next Steps After Installation

### Immediate (Today)
1. ✅ Run locally
2. ✅ Test all features
3. ✅ Explore codebase

### Short Term (This Week)
1. Customize branding
2. Test with real PDFs
3. Review codebase

### Medium Term (This Month)
1. Deploy to Vercel
2. Set up custom domain
3. Configure monitoring

### Long Term (Next 3 Months)
1. Gather user feedback
2. Add custom features
3. Optimize performance

## Need More Help?

### Documentation
- **Quick Start**: Read SETUP.md (10 min)
- **Full Features**: Read README.md
- **Deployment**: Read DEPLOYMENT.md
- **Architecture**: Read ARCHITECTURE.md

### Getting Unstuck
1. Check the error message carefully
2. Search in documentation
3. Review similar code in project
4. Try with test data
5. Check API service status

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Docs](https://stripe.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)
- [Neon Docs](https://neon.tech/docs)

## Development Tools Setup (Optional)

### VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "github.copilot",
    "ms-azuretools.vscode-docker"
  ]
}
```

### Stripe CLI (for testing webhooks)
```bash
# Install
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Test webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Database Inspection
```bash
# Connect to your database
psql $DATABASE_URL

# List tables
\dt

# View data
SELECT * FROM "user" LIMIT 5;
```

## Production Deployment Checklist

Before deploying to production:

### Security
- [ ] Generate new BETTER_AUTH_SECRET
- [ ] Use production database
- [ ] Use production Stripe keys
- [ ] Remove console.log debug statements
- [ ] Enable HTTPS
- [ ] Set up error tracking

### Configuration
- [ ] Update BETTER_AUTH_URL to your domain
- [ ] Configure Stripe webhooks
- [ ] Set up email service
- [ ] Configure backups
- [ ] Monitor logs

### Testing
- [ ] Test all features
- [ ] Test payments
- [ ] Test error scenarios
- [ ] Load test database
- [ ] Mobile testing

### Launch
- [ ] Deploy to Vercel
- [ ] Set custom domain
- [ ] Monitor for errors
- [ ] Celebrate! 🎉

## Support

**Getting Help:**
1. Check documentation first
2. Search GitHub issues
3. Review code examples
4. Post in community forums
5. Contact support

**Reporting Bugs:**
- Provide error message
- Include steps to reproduce
- Share environment details
- Attach relevant code

## You're All Set! 🚀

You now have a fully functional SaaS application with:
- ✅ User authentication
- ✅ PDF upload
- ✅ AI-powered features
- ✅ Subscription billing
- ✅ Admin dashboard
- ✅ Production-ready code

**Next step: Customize and deploy!**

---

Questions? Check README.md or SETUP.md
Ready to deploy? Read DEPLOYMENT.md
Want to understand how it works? Check ARCHITECTURE.md
