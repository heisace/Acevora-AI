'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getDocuments, getDocument } from '@/app/actions/documents'
import { getSubscription } from '@/app/actions/subscription'
import Link from 'next/link'

interface Document {
  id: string
  title: string
  description?: string
  fileName: string
  fileSize: number
  pageCount?: number
  createdAt: Date
}

interface Subscription {
  plan: 'free' | 'pro' | 'enterprise'
  status: string
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [docs, sub] = await Promise.all([
          getDocuments(),
          getSubscription(),
        ])
        setDocuments(docs)
        setSubscription(sub as Subscription)
      } catch (error) {
        console.error('[v0] Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {subscription && (
              <>Plan: <span className="font-semibold capitalize">{subscription.plan}</span></>
            )}
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>Upload Document</Button>
        </Link>
      </div>

      {/* Documents Section */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Documents</h2>
        
        {documents.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No documents yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
              Upload your first document to get started with AI-powered learning
            </p>
            <Link href="/dashboard/upload">
              <Button>Upload Your First Document</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Link key={doc.id} href={`/dashboard/document/${doc.id}`}>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow hover:shadow-lg transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                  <div className="text-xs text-slate-500 dark:text-slate-500 space-y-1">
                    <p>📄 {doc.fileName}</p>
                    {doc.pageCount && <p>📑 {doc.pageCount} pages</p>}
                    <p>📦 {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
