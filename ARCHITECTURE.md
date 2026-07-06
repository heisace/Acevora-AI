# StudyGen AI - Architecture Documentation

High-level overview of StudyGen AI's architecture, design decisions, and component interactions.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
│  (Next.js Pages, Components, Client State with React)           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    HTTPS/WebSocket
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      Vercel Edge                                │
│  (Next.js Server, API Routes, Middleware)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
      ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     Neon     │  │  OpenAI      │  │   Stripe     │
│  PostgreSQL  │  │   API        │  │   API        │
└──────────────┘  └──────────────┘  └──────────────┘
      │
      └──────────────────┐
                         ▼
                  ┌──────────────┐
                  │ Vercel Blob  │
                  │   Storage    │
                  └──────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React hooks + SWR for data fetching

### Backend
- **Runtime**: Node.js (Vercel)
- **Framework**: Next.js App Router
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle
- **Auth**: Better Auth
- **API**: RESTful with Next.js API Routes

### External Services
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Storage**: Vercel Blob
- **Database Hosting**: Neon

## Database Schema

### Better Auth Tables
```
user
├── id (PK)
├── email (UNIQUE)
├── emailVerified
├── name
├── image
└── timestamps

session
├── id (PK)
├── userId (FK)
├── token (UNIQUE)
├── expiresAt
└── timestamps

account
├── id (PK)
├── userId (FK)
├── provider
├── providerAccountId
└── tokens

verification
├── id (PK)
├── identifier
├── value
└── expiresAt
```

### Application Tables
```
subscription
├── id (PK)
├── userId (FK, UNIQUE)
├── plan ('free' | 'pro' | 'enterprise')
├── stripeCustomerId
├── stripeSubscriptionId
├── currentPeriodStart/End
└── timestamps

document
├── id (PK)
├── userId (FK)
├── title
├── description
├── fileName
├── fileSize
├── blobUrl
├── pageCount
└── timestamps

summary
├── id (PK)
├── documentId (FK)
├── userId (FK)
├── content
├── length ('short' | 'medium' | 'long')
└── timestamps

flashcard
├── id (PK)
├── documentId (FK)
├── userId (FK)
├── front
├── back
├── difficulty
├── timesReviewed
└── timestamps

quiz
├── id (PK)
├── documentId (FK)
├── userId (FK)
├── title
├── questions (JSONB)
├── totalQuestions
├── passingScore
└── timestamps

quizAttempt
├── id (PK)
├── quizId (FK)
├── userId (FK)
├── score
├── answers (JSONB)
├── passed
├── timeSpentSeconds
└── completedAt

billingHistory
├── id (PK)
├── userId (FK)
├── stripeInvoiceId (UNIQUE)
├── amount
├── status
├── invoiceUrl
└── timestamps

adminLog
├── id (PK)
├── adminId (FK)
├── action
├── targetUserId
├── details (JSONB)
└── timestamps
```

## Authentication Flow

```
User Input
    │
    ▼
Auth Form (Client)
    │
    ├─── Sign Up
    │     │
    │     ▼
    │  Create User (Better Auth)
    │     │
    │     ▼
    │  Hash Password (bcrypt)
    │     │
    │     ▼
    │  Create Default Subscription
    │     │
    │     └──→ Session Cookie
    │
    └─── Sign In
          │
          ▼
       Verify Credentials
          │
          ▼
       Create Session
          │
          └──→ Session Cookie
```

## API Routes

### Authentication (`/api/auth/[...all]`)
- Better Auth handler mounted here
- Handles sign-up, sign-in, sign-out
- Session management
- Email verification

### File Upload (`/api/upload`)
- POST: Upload PDF to Vercel Blob
- Returns: Public/private URL for the file
- Validates: File type, size limits
- Security: User authentication required

### Webhooks (`/api/webhooks/stripe`)
- Receives Stripe events
- Updates subscription status
- Records billing history
- Handles subscription cancellations

### Admin Stats (`/api/admin/stats`)
- GET: Aggregate statistics
- Returns: User count, documents, revenue, subscriptions
- Security: Admin authentication required

## Server Actions Flow

```
User Action (Button Click)
    │
    ▼
Client Component
    │
    ▼
Call Server Action
    │
    ▼
Server Action Handler
├── Verify Authentication (getUserId)
├── Validate Input
├── Query/Update Database
└── Return Result
    │
    ▼
Client Component Updates
    │
    ▼
UI Refresh (via revalidatePath)
```

### Example: Document Upload
```typescript
// Client: components/upload-form.tsx
handleSubmit() → uploadDocument(title, file)

// Server: app/actions/documents.ts
uploadDocument()
├── getUserId() // Verify auth
├── validateInput()
├── db.insert(document) // Save metadata
├── revalidatePath() // Invalidate cache
└── Return documentId

// Database Enforces
└── userId scope on all queries
```

## AI Generation Flow

```
User Request
    │
    ▼
Generate Summary/Flashcards/Quiz
    │
    ├─── Validate Permissions
    │     └─ Check subscription plan limits
    │
    ├─── Extract Document Text
    │
    ├─── Call OpenAI API
    │     ├─ Model: gpt-4o-mini
    │     ├─ Prompt: Task-specific
    │     └─ Temperature: 0.7
    │
    ├─── Parse Response
    │     └─ Validate JSON structure
    │
    ├─── Store in Database
    │
    └─── Return to Client
```

## Subscription & Billing Flow

```
User Upgrade Request
    │
    ▼
Click "Subscribe to Pro"
    │
    ▼
createCheckoutSession()
    │
    ├─ Get user email
    ├─ Get Stripe price ID
    └─ Create Stripe session
    │
    ▼
Redirect to Stripe Checkout
    │
    ├─ User enters payment info
    └─ Stripe processes payment
    │
    ▼
Stripe sends webhook
    │
    ├─ checkout.session.completed
    │  └─ Update subscription to 'pro'
    │
    └─ invoice.payment_succeeded
       └─ Create billing history record
```

## Data Flow for Document Processing

```
1. Upload Phase
   PDF File → Vercel Blob → blobUrl stored in DB

2. Generation Phase
   Document → Extract Text → OpenAI → Parse Response → Store in DB

3. Study Phase
   User → Select Flashcard/Quiz → Increment stats → Track performance
```

## Performance Considerations

### Database
- Indexed on userId for faster queries
- Connection pooling via Neon
- Query optimization with Drizzle
- Lazy loading for large result sets

### Frontend
- Server-side rendering (RSC) where possible
- Client-side caching with SWR
- Incremental static regeneration for heavy pages
- Image optimization with Next.js

### API
- Request timeout: 30 seconds default
- Rate limiting on file uploads
- Stripe webhook retry logic
- OpenAI timeout handling with fallback

## Security Architecture

### Authentication
- Passwords hashed with bcrypt
- Sessions stored securely in database
- CSRF tokens on form submissions
- HTTPS only in production

### Authorization
- userId-based access control
- Row-level scoping on all queries
- Admin checks on admin endpoints
- Subscription plan enforcement

### Data Protection
- Private Blob storage (not public URLs)
- Encrypted at rest (Neon default)
- Encrypted in transit (HTTPS)
- Environment variables never exposed

### API Security
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS prevention (React escaping)
- Rate limiting (recommended addition)

## Scaling Strategy

### Database Scaling
```
Phase 1: Single Neon instance
         ↓
Phase 2: Add read replicas
         ↓
Phase 3: Sharding by userId
         ↓
Phase 4: Dedicated clusters per region
```

### Application Scaling
```
Vercel handles auto-scaling:
- Separate serverless functions
- Automatic load balancing
- Geographic distribution
- Edge caching
```

### AI Service Scaling
```
OpenAI API handles scaling:
- Rate limits per tier
- Queue-based processing
- Fallback models
- Caching for common queries
```

## Error Handling

### Client Layer
- Form validation with Zod
- User-friendly error messages
- Retry logic for failed requests
- Fallback UI states

### Server Layer
- Try-catch in server actions
- Logging with console (stderr)
- Error tracking (Sentry recommended)
- Graceful degradation

### API Layer
- HTTP status codes (4xx, 5xx)
- Error message structure
- Timeout handling
- Webhook retry logic

## Deployment Architecture

```
Git Push to Main
    │
    ▼
Vercel Build
├─ Next.js Compile
├─ TypeScript Check
├─ Run Tests
└─ Create Deployment
    │
    ▼
Deployment Ready
    │
    ├─ Route to Edge Network
    ├─ Connect to Neon
    ├─ Load Environment Variables
    └─ Start Serverless Functions
```

## Monitoring & Observability

### Metrics to Track
- Page load time (Core Web Vitals)
- API response time
- Database query performance
- Error rate
- User signup/conversion rate
- Subscription churn rate
- Storage usage
- API costs

### Recommended Tools
- **Monitoring**: Vercel Analytics + Sentry
- **Logging**: Vercel logs + custom logging
- **Tracing**: OpenTelemetry (optional)
- **Alerting**: Vercel alerts + email
