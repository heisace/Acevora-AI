'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { uploadDocument } from '@/app/actions/documents'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file')
        return
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
        return
      }
      setFile(selectedFile)
      setError('')
      if (!title) {
        setTitle(selectedFile.name.replace('.pdf', ''))
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !title) {
      setError('Please select a file and enter a title')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append('file', file)

      const blobResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!blobResponse.ok) {
        throw new Error('Failed to upload file')
      }

      const { url } = await blobResponse.json()

      // Create document in database
      await uploadDocument(
        title,
        description,
        file.name,
        file.size,
        url,
        0
      )

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('[v0] Upload error:', err)
      setError('Failed to upload document. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Upload Document</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Upload a PDF to get started with AI-powered learning
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              PDF Document
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                {file ? (
                  <div>
                    <p className="text-green-600 dark:text-green-400 font-medium">{file.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Click to select or drag and drop a PDF
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      Max 50MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your document"
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!file || !title || uploading}
              className="flex-1"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
