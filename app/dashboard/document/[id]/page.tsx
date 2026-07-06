'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getDocument, getDocumentSummaries, getDocumentFlashcards, getDocumentQuizzes } from '@/app/actions/documents'
import { generateSummary, generateFlashcards, generateQuiz } from '@/app/actions/ai'
import Link from 'next/link'

interface DocumentDetailPageProps {
  params: { id: string }
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const [doc, setDoc] = useState<any>(null)
  const [summaries, setSummaries] = useState<any[]>([])
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [document, sums, cards, quizzez] = await Promise.all([
          getDocument(params.id),
          getDocumentSummaries(params.id),
          getDocumentFlashcards(params.id),
          getDocumentQuizzes(params.id),
        ])
        setDoc(document)
        setSummaries(sums)
        setFlashcards(cards)
        setQuizzes(quizzez)
      } catch (error) {
        console.error('[v0] Failed to load document:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const handleGenerateSummary = async () => {
    setGenerating(true)
    try {
      await generateSummary(params.id, 'Document content here', { length: 'medium' })
      const updated = await getDocumentSummaries(params.id)
      setSummaries(updated)
    } catch (error) {
      console.error('[v0] Failed to generate summary:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateFlashcards = async () => {
    setGenerating(true)
    try {
      await generateFlashcards(params.id, 'Document content here', { count: 10 })
      const updated = await getDocumentFlashcards(params.id)
      setFlashcards(updated)
    } catch (error) {
      console.error('[v0] Failed to generate flashcards:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateQuiz = async () => {
    setGenerating(true)
    try {
      await generateQuiz(params.id, 'Document content here', { questionCount: 10 })
      const updated = await getDocumentQuizzes(params.id)
      setQuizzes(updated)
    } catch (error) {
      console.error('[v0] Failed to generate quiz:', error)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Document not found</p>
        <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline mt-4">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-4 mb-2">{doc.title}</h1>
        {doc.description && (
          <p className="text-slate-600 dark:text-slate-400">{doc.description}</p>
        )}
      </div>

      {/* Summaries Section */}
      <section className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Summaries</h2>
          <Button onClick={handleGenerateSummary} disabled={generating}>
            Generate Summary
          </Button>
        </div>
        {summaries.length > 0 ? (
          <div className="space-y-4">
            {summaries.map((summary: any) => (
              <div key={summary.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{summary.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-3">{summary.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-500">No summaries yet. Generate one to get started!</p>
        )}
      </section>

      {/* Flashcards Section */}
      <section className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Flashcards ({flashcards.length})</h2>
          <Button onClick={handleGenerateFlashcards} disabled={generating}>
            Generate Flashcards
          </Button>
        </div>
        {flashcards.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {flashcards.map((card: any) => (
              <div key={card.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="font-semibold text-slate-900 dark:text-white text-sm mb-2">{card.front}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{card.back}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-500">No flashcards yet. Generate some to study!</p>
        )}
      </section>

      {/* Quizzes Section */}
      <section className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quizzes ({quizzes.length})</h2>
          <Button onClick={handleGenerateQuiz} disabled={generating}>
            Generate Quiz
          </Button>
        </div>
        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map((q: any) => (
              <div key={q.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{q.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{q.totalQuestions} questions</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-500">No quizzes yet. Generate one to test your knowledge!</p>
        )}
      </section>
    </div>
  )
}
