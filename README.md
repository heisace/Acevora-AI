# StudyGen AI - Learn Smarter with AI

A production-ready SaaS application that transforms study materials into AI-powered summaries, flashcards, and interactive quizzes.

## Features

- 📄 **PDF Document Upload** - Upload and manage study materials
- 🤖 **AI Summaries** - Generate concise summaries at multiple lengths (short, medium, long)
- 📇 **Flashcard Generation** - Automatically create study flashcards with spaced repetition
- ✅ **Interactive Quizzes** - AI-generated multiple-choice quizzes for knowledge testing
- 💳 **Stripe Subscriptions** - Tiered pricing plans (Free, Pro, Enterprise)
- 👥 **User Authentication** - Secure email/password authentication
- 📊 **Admin Dashboard** - Monitor usage, revenue, and user metrics
- 📱 **Responsive Design** - Mobile-friendly interface
- 🌙 **Dark Mode Support** - Seamless light/dark theme switching

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible UI components

### Backend
- **Neon PostgreSQL** - Serverless database
- **Drizzle ORM** - Type-safe database queries
- **Better Auth** - Modern authentication system
- **Stripe** - Payment processing and subscriptions
- **Vercel Blob** - File storage for PDFs
- **OpenAI** - AI-powered text generation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon)
- Stripe account
- OpenAI API key
- Vercel Blob storage

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Database
DATABASE_URL=postgresql://user:password@host/dbname

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Storage
BLOB_READ_WRITE_TOKEN=...
```

### Installation

1. **Install dependencies**
```bash
pnpm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

3. **Run development server**
```bash
pnpm dev
```

4. **Open the app**
Navigate to `http://localhost:3000`

## Project Structure

```
studygen-ai/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/          # Authentication endpoints
│   │   ├── upload/                 # PDF upload handler
│   │   ├── webhooks/stripe/        # Stripe webhook
│   │   └── admin/stats/            # Admin statistics
│   ├── dashboard/
│   │   ├── document/[id]/          # Document detail view
│   │   ├── upload/                 # Document upload page
│   │   └── page.tsx                # Dashboard home
│   ├── admin/                      # Admin dashboard
│   ├── pricing/                    # Pricing page
│   ├── sign-in/                    # Sign in page
│   ├── sign-up/                    # Sign up page
│   └── page.tsx                    # Home page
├── components/
│   ├── ui/                         # shadcn/ui components
│   └── auth-form.tsx               # Authentication form
├── lib/
│   ├── auth.ts                     # Better Auth configuration
│   ├── auth-client.ts              # Client-side auth
│   ├── db/
│   │   ├── index.ts                # Drizzle instance
│   │   └── schema.ts               # Database schema
│   └── utils.ts                    # Utility functions
├── app/
│   ├── actions/
│   │   ├── documents.ts            # Document server actions
│   │   ├── ai.ts                   # AI generation actions
│   │   └── subscription.ts         # Subscription management
├── __tests__/                      # Test files
├── public/                         # Static assets
└── package.json
```

## Key Features Documentation

### Authentication
- Email/password signup and signin
- Secure session management with Better Auth
- Password hashing with bcrypt
- Email verification (optional)

### PDF Upload
- Accept PDF files up to 50MB
- Store files in Vercel Blob (private access)
- Track document metadata (filename, size, pages)
- Support for batch operations

### AI Features
- **Summaries**: Generate 3 length options (short: 2-3 paragraphs, medium: 4-5, long: 6-8)
- **Flashcards**: Auto-generate Q&A pairs with difficulty levels
- **Quizzes**: Multiple-choice questions with adjustable difficulty

### Subscription System
- **Free Plan**: 5 documents, limited features
- **Pro Plan**: $19.99/month - 50 documents, unlimited features
- **Enterprise**: $99.99/month - Custom limits and support

### Admin Dashboard
- User statistics
- Document upload tracking
- Revenue monitoring
- Subscription metrics

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Create account
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout

### Documents
- `POST /api/upload` - Upload PDF
- `GET /api/documents` - List documents
- `DELETE /api/documents/[id]` - Delete document

### AI Generation
- `POST /api/summaries` - Generate summary
- `POST /api/flashcards` - Generate flashcards
- `POST /api/quizzes` - Generate quiz

### Subscriptions
- `POST /api/checkout` - Create checkout session
- `GET /api/subscription` - Get current plan
- `POST /api/webhooks/stripe` - Stripe webhooks

## Testing

Run tests with:
```bash
pnpm test
```

Test files are located in `__tests__/` directory covering:
- Authentication flows
- Document management
- Subscription handling

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial StudyGen AI commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Configure Stripe Webhook**
   - Go to Stripe Dashboard
   - Set webhook endpoint to: `https://yourdomain.com/api/webhooks/stripe`
   - Add webhook events: checkout.session.completed, invoice.payment_succeeded, etc.

### Environment Variables for Production
Set these in Vercel project settings:
- `DATABASE_URL` - Production Neon database
- `BETTER_AUTH_SECRET` - Secure random string
- `OPENAI_API_KEY` - OpenAI API key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook secret
- All other keys from `.env.example`

## Database Schema

### Core Tables
- **user** - User accounts
- **session** - Active sessions
- **account** - OAuth connections
- **verification** - Email verification tokens

### App Tables
- **subscription** - User subscriptions and billing
- **document** - Uploaded PDF documents
- **summary** - Generated summaries
- **flashcard** - Study flashcards
- **quiz** - Generated quizzes
- **quizAttempt** - Quiz performance tracking
- **billingHistory** - Payment records
- **adminLog** - Audit trail

## Performance Optimization

- Server-side rendering for initial page load
- Image optimization with Next.js Image component
- Database query optimization with Drizzle
- Caching with revalidateTag for fresh data
- Compression and minification in production
- CDN for static assets

## Security

- CSRF protection with Better Auth
- XSS protection through React escaping
- SQL injection prevention with parameterized queries
- Secure password hashing (bcrypt)
- HTTPS enforced in production
- Private file access with Blob storage
- Rate limiting on API endpoints (recommended)

## Support & Maintenance

### Monitoring
- Set up error tracking (Sentry recommended)
- Monitor database performance
- Track API usage and costs
- Review admin logs regularly

### Updates
- Keep Next.js and dependencies updated
- Test updates in staging before production
- Monitor security advisories

## Troubleshooting

### Common Issues

**Database Connection Error**
- Verify DATABASE_URL is correct
- Check Neon console for connection limits
- Ensure IP whitelist includes your server

**File Upload Failing**
- Check BLOB_READ_WRITE_TOKEN
- Verify file is PDF format
- Check file size < 50MB

**Stripe Webhook Not Firing**
- Verify webhook secret matches
- Check Stripe dashboard for webhook logs
- Ensure endpoint is publicly accessible

**AI Generation Timeout**
- Check OpenAI API status
- Verify API key is valid
- Consider retry logic for failures

## License

MIT - See LICENSE file for details

## Contributing

Contributions welcome! Please follow these steps:
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Submit pull request

## Contact & Support

- Email: support@studygenai.com
- Twitter: @StudyGenAI
- Discord: [Join community](https://discord.gg/studygenai)
