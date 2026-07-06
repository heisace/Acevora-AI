'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { subscription } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { generateId } from '@/lib/utils'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
})

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getSubscription() {
  const userId = await getUserId()

  const result = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)

  if (!result.length) {
    // Create default free subscription
    const subId = generateId()
    await db.insert(subscription).values({
      id: subId,
      userId,
      plan: 'free',
      status: 'active',
    })
    return { id: subId, userId, plan: 'free', status: 'active' }
  }

  return result[0]
}

export async function createCheckoutSession(plan: 'pro' | 'enterprise') {
  const userId = await getUserId()
  const userSession = await auth.api.getSession({ headers: await headers() })
  const userEmail = userSession?.user?.email

  const priceIds = {
    pro: process.env.STRIPE_PRICE_ID_PRO || '',
    enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
  }

  if (!priceIds[plan]) {
    throw new Error(`Price ID not configured for plan: ${plan}`)
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    line_items: [
      {
        price: priceIds[plan],
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.BETTER_AUTH_URL || process.env.VERCEL_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BETTER_AUTH_URL || process.env.VERCEL_URL}/pricing`,
    metadata: {
      userId,
      plan,
    },
  })

  return { checkoutUrl: session.url }
}

export async function updateSubscription(
  plan: 'free' | 'pro' | 'enterprise',
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
) {
  const userId = await getUserId()

  const existing = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(subscription)
      .set({
        plan,
        stripeCustomerId,
        stripeSubscriptionId,
      })
      .where(eq(subscription.userId, userId))
  } else {
    await db.insert(subscription).values({
      id: generateId(),
      userId,
      plan,
      stripeCustomerId,
      stripeSubscriptionId,
    })
  }

  revalidatePath('/dashboard')
}

export async function cancelSubscription() {
  const userId = await getUserId()

  await db
    .update(subscription)
    .set({ plan: 'free', stripeSubscriptionId: null, cancelAtPeriodEnd: true })
    .where(eq(subscription.userId, userId))

  revalidatePath('/dashboard')
}
