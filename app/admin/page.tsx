'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

interface AdminStats {
  totalUsers: number
  totalDocuments: number
  totalRevenue: number
  activePaidSubscriptions: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('[v0] Failed to load admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Users',
              value: stats?.totalUsers || 0,
              icon: '👥',
            },
            {
              label: 'Documents Uploaded',
              value: stats?.totalDocuments || 0,
              icon: '📄',
            },
            {
              label: 'Total Revenue',
              value: `$${((stats?.totalRevenue || 0) / 100).toFixed(2)}`,
              icon: '💰',
            },
            {
              label: 'Paid Subscriptions',
              value: stats?.activePaidSubscriptions || 0,
              icon: '⭐',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
            >
              <p className="text-4xl mb-2">{stat.icon}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Admin Actions</h2>
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Access additional admin functionality through these links:
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button>User Management</Button>
              <Button variant="outline">Subscription Management</Button>
              <Button variant="outline">System Logs</Button>
              <Button variant="outline">Export Analytics</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
