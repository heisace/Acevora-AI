import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user, document, subscription, billingHistory } from '@/lib/db/schema'
import { eq, and, sum } from 'drizzle-orm'

export async function GET() {
  try {
    // Get total users
    const totalUsersResult = await db.select({ count: user.id }).from(user)
    const totalUsers = totalUsersResult.length

    // Get total documents
    const totalDocumentsResult = await db.select({ count: document.id }).from(document)
    const totalDocuments = totalDocumentsResult.length

    // Get total revenue (sum of paid invoices)
    const totalRevenueResult = await db
      .select({ total: sum(billingHistory.amount) })
      .from(billingHistory)
      .where(eq(billingHistory.status, 'paid'))

    const totalRevenue = totalRevenueResult[0]?.total || 0

    // Get active paid subscriptions
    const activePaidResult = await db
      .select({ count: subscription.id })
      .from(subscription)
      .where(and(
        eq(subscription.status, 'active'),
        eq(subscription.cancelAtPeriodEnd, false)
      ))

    const activePaidSubscriptions = activePaidResult.length

    return NextResponse.json({
      totalUsers,
      totalDocuments,
      totalRevenue,
      activePaidSubscriptions,
    })
  } catch (error) {
    console.error('[v0] Failed to fetch admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
