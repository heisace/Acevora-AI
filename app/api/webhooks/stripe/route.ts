import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscription, billingHistory } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateId } from '@/lib/utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[v0] Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          const plan = session.metadata?.plan || 'pro'

          await db
            .update(subscription)
            .set({
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan: plan as 'pro' | 'enterprise',
              status: 'active',
            })
            .where(eq(subscription.userId, userId))
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const userId = invoice.metadata?.userId

        if (userId) {
          await db.insert(billingHistory).values({
            id: generateId(),
            userId,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid || 0,
            currency: invoice.currency,
            status: 'paid',
            description: invoice.description,
            invoiceUrl: invoice.hosted_invoice_url,
            invoicePdfUrl: invoice.invoice_pdf,
            paidAt: new Date(invoice.paid_date ? invoice.paid_date * 1000 : Date.now()),
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        // Find user by Stripe customer ID and downgrade to free
        const userSub = await db
          .select()
          .from(subscription)
          .where(eq(subscription.stripeCustomerId, customerId))
          .limit(1)

        if (userSub.length > 0) {
          await db
            .update(subscription)
            .set({
              plan: 'free',
              stripeSubscriptionId: null,
              status: 'canceled',
            })
            .where(eq(subscription.userId, userSub[0].userId))
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        const userSub = await db
          .select()
          .from(subscription)
          .where(eq(subscription.stripeCustomerId, customerId))
          .limit(1)

        if (userSub.length > 0) {
          await db
            .update(subscription)
            .set({
              status: sub.status,
              currentPeriodStart: sub.current_period_start ? new Date(sub.current_period_start * 1000) : null,
              currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            })
            .where(eq(subscription.userId, userSub[0].userId))
        }
        break
      }

      default:
        console.log(`[v0] Unhandled webhook event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
