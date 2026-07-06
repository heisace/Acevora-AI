import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    documentsLimit: 5,
    summariesPerDay: 5,
    flashcardsPerDocument: 20,
    quizzesPerDocument: 2,
    features: [
      'Upload up to 5 documents',
      '5 summaries per day',
      'Basic flashcards',
      'Limited quizzes',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'For serious learners',
    price: 1999,
    documentsLimit: 50,
    summariesPerDay: 100,
    flashcardsPerDocument: Infinity,
    quizzesPerDocument: Infinity,
    features: [
      'Upload up to 50 documents',
      '100 summaries per day',
      'Unlimited flashcards',
      'Unlimited quizzes',
      'Advanced analytics',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For organizations',
    price: 9999,
    documentsLimit: Infinity,
    summariesPerDay: Infinity,
    flashcardsPerDocument: Infinity,
    quizzesPerDocument: Infinity,
    features: [
      'Unlimited documents',
      'Unlimited summaries',
      'Unlimited flashcards',
      'Unlimited quizzes',
      'Advanced analytics',
      'Dedicated support',
      'Custom integrations',
      'Team management',
    ],
  },
}

export type Plan = keyof typeof SUBSCRIPTION_PLANS
