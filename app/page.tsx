import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">StudyGen AI</div>
          <div className="flex gap-4">
            <Link href="/chat">
              <Button>Get Started Free</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Connect Account</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Learn Smarter with AI
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Transform your study materials into AI-powered summaries, flashcards, and interactive quizzes. Master any subject faster.
          </p>
          <Link href="/chat">
            <Button size="lg" className="text-lg px-8">Start Learning Free</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Smart Summaries',
              description: 'AI-generated summaries extract key concepts from your documents instantly',
              icon: '📄',
            },
            {
              title: 'Flashcard Generation',
              description: 'Automatically create flashcards for spaced repetition learning',
              icon: '🎯',
            },
            {
              title: 'Interactive Quizzes',
              description: 'Test your knowledge with AI-powered adaptive quizzes',
              icon: '✅',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center shadow-lg"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2025 StudyGen AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
