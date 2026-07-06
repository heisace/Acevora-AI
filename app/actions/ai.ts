'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { summary, flashcard, quiz } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { generateId } from '@/lib/utils'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

interface SummaryConfig {
  length: 'short' | 'medium' | 'long'
}

export async function generateSummary(
  documentId: string,
  documentText: string,
  config: SummaryConfig
) {
  const userId = await getUserId()

  const lengthGuide = {
    short: 'a concise 2-3 paragraph summary',
    medium: 'a balanced 4-5 paragraph summary',
    long: 'a detailed 6-8 paragraph summary',
  }

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Please create ${lengthGuide[config.length]} of the following document:\n\n${documentText}`,
    temperature: 0.7,
  })

  const summaryId = generateId()

  await db.insert(summary).values({
    id: summaryId,
    documentId,
    userId,
    title: `Summary - ${new Date().toLocaleDateString()}`,
    content: text,
    length: config.length,
  })

  revalidatePath(`/dashboard/document/${documentId}`)
  return { id: summaryId, content: text }
}

interface FlashcardConfig {
  count: number
}

export async function generateFlashcards(
  documentId: string,
  documentText: string,
  config: FlashcardConfig
) {
  const userId = await getUserId()

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Generate exactly ${config.count} flashcard question-answer pairs from this document. Format as JSON array with objects containing "front" and "back" fields:\n\n${documentText}`,
    temperature: 0.7,
  })

  let flashcards = []
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      flashcards = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('[v0] Failed to parse flashcards JSON:', e)
  }

  const createdFlashcards = []
  for (const card of flashcards) {
    if (card.front && card.back) {
      const cardId = generateId()
      await db.insert(flashcard).values({
        id: cardId,
        documentId,
        userId,
        front: card.front,
        back: card.back,
        difficulty: 'medium',
      })
      createdFlashcards.push(cardId)
    }
  }

  revalidatePath(`/dashboard/document/${documentId}`)
  return { createdCount: createdFlashcards.length, ids: createdFlashcards }
}

interface QuizConfig {
  questionCount: number
}

export async function generateQuiz(
  documentId: string,
  documentText: string,
  config: QuizConfig
) {
  const userId = await getUserId()

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Generate exactly ${config.questionCount} multiple-choice quiz questions from this document. Format as JSON array with objects containing "question", "options" (array of 4 strings), and "correctAnswer" (0-3 index):\n\n${documentText}`,
    temperature: 0.7,
  })

  let questions = []
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      questions = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('[v0] Failed to parse quiz JSON:', e)
  }

  if (questions.length === 0) {
    questions = [
      {
        question: 'What is the main topic of the document?',
        options: ['Topic A', 'Topic B', 'Topic C', 'Topic D'],
        correctAnswer: 0,
      },
    ]
  }

  const quizId = generateId()

  await db.insert(quiz).values({
    id: quizId,
    documentId,
    userId,
    title: `Quiz - ${new Date().toLocaleDateString()}`,
    questions: questions,
    totalQuestions: questions.length,
  })

  revalidatePath(`/dashboard/document/${documentId}`)
  return { id: quizId, questionCount: questions.length }
}
