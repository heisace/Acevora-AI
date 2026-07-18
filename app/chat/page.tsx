'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Simple rate limiting: max 15 messages per hour for anonymous users
const RATE_LIMIT = 15
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

export default function AnonymousChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load conversation from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('anonymousChatHistory')
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
        setMessages(parsed)
      } catch (e) {
        console.error('Failed to load chat history', e)
      }
    }
  }, [])

  // Save to localStorage
  const saveToLocalStorage = (msgs: Message[]) => {
    localStorage.setItem('anonymousChatHistory', JSON.stringify(msgs))
  }

  // Check rate limit
  const checkRateLimit = (): boolean => {
    const now = Date.now()
    const history = JSON.parse(localStorage.getItem('anonymousChatRateLimit') || '[]') as number[]
    
    // Remove old entries
    const validHistory = history.filter(time => now - time < RATE_LIMIT_WINDOW)
    
    if (validHistory.length >= RATE_LIMIT) {
      setError('You\'ve reached the limit for anonymous users. Please connect an account for unlimited access.')
      return false
    }
    
    // Add current time
    validHistory.push(now)
    localStorage.setItem('anonymousChatRateLimit', JSON.stringify(validHistory))
    return true
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    if (!checkRateLimit()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Call anonymous AI endpoint
      const response = await fetch('/api/chat/anonymous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      saveToLocalStorage(finalMessages)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      // Remove the user message if failed
      setMessages(messages)
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('anonymousChatHistory')
    localStorage.removeItem('anonymousChatRateLimit')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">StudyGen AI</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Anonymous Chat</div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={clearChat}>
            Clear Chat
          </Button>
          <Link href="/sign-in">
            <Button size="sm">Connect Account</Button>
          </Link>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Start chatting with AI
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Ask anything about your studies. Your conversations are saved locally in your browser.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                Rate limit: {RATE_LIMIT} messages per hour for anonymous users
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
              <div className="text-[10px] opacity-60 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your studies..."
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
        <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-2">
          Conversations are saved locally. Connect an account for cloud sync and unlimited access.
        </p>
      </div>
    </div>
  )
}
