import { pgTable, text, timestamp, boolean, integer, jsonb, unique } from 'drizzle-orm/pg-core'

// ===== Better Auth Tables (Required) =====

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull(),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refreshToken: text('refreshToken'),
    accessToken: text('accessToken'),
    expiresAt: timestamp('expiresAt'),
    tokenType: text('tokenType'),
    scope: text('scope'),
    idToken: text('idToken'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    providerUnique: unique('provider_account_unique').on(
      table.provider,
      table.providerAccountId
    ),
  })
)

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt'),
})

// ===== StudyGen Tables =====

export const subscription = pgTable(
  'subscription',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().unique(),
    plan: text('plan').notNull().default('free'),
    stripeCustomerId: text('stripeCustomerId').unique(),
    stripeSubscriptionId: text('stripeSubscriptionId').unique(),
    status: text('status').notNull().default('active'),
    currentPeriodStart: timestamp('currentPeriodStart'),
    currentPeriodEnd: timestamp('currentPeriodEnd'),
    cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').default(false),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  }
)

export const document = pgTable('document', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  fileName: text('fileName').notNull(),
  fileSize: integer('fileSize').notNull(),
  blobUrl: text('blobUrl').notNull(),
  pageCount: integer('pageCount'),
  uploadedAt: timestamp('uploadedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const summary = pgTable('summary', {
  id: text('id').primaryKey(),
  documentId: text('documentId').notNull(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  length: text('length').notNull().default('medium'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const flashcard = pgTable('flashcard', {
  id: text('id').primaryKey(),
  documentId: text('documentId').notNull(),
  userId: text('userId').notNull(),
  front: text('front').notNull(),
  back: text('back').notNull(),
  difficulty: text('difficulty').default('medium'),
  timesReviewed: integer('timesReviewed').default(0),
  lastReviewedAt: timestamp('lastReviewedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const quiz = pgTable('quiz', {
  id: text('id').primaryKey(),
  documentId: text('documentId').notNull(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  questions: jsonb('questions').notNull(),
  totalQuestions: integer('totalQuestions').notNull(),
  passingScore: integer('passingScore').default(70),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const quizAttempt = pgTable('quizAttempt', {
  id: text('id').primaryKey(),
  quizId: text('quizId').notNull(),
  userId: text('userId').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('totalQuestions').notNull(),
  answers: jsonb('answers').notNull(),
  passed: boolean('passed').notNull(),
  timeSpentSeconds: integer('timeSpentSeconds'),
  completedAt: timestamp('completedAt').notNull().defaultNow(),
})

export const billingHistory = pgTable('billingHistory', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  stripeInvoiceId: text('stripeInvoiceId').unique(),
  amount: integer('amount').notNull(),
  currency: text('currency').default('usd'),
  status: text('status').notNull(),
  description: text('description'),
  invoiceUrl: text('invoiceUrl'),
  invoicePdfUrl: text('invoicePdfUrl'),
  paidAt: timestamp('paidAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const adminLog = pgTable('adminLog', {
  id: text('id').primaryKey(),
  adminId: text('adminId').notNull(),
  action: text('action').notNull(),
  targetUserId: text('targetUserId'),
  targetType: text('targetType'),
  details: jsonb('details'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
