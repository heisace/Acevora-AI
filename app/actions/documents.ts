'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { document, summary, flashcard, quiz } from '@/lib/db/schema'
import { and, eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { generateId } from '@/lib/utils'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function uploadDocument(
  title: string,
  description: string,
  fileName: string,
  fileSize: number,
  blobUrl: string,
  pageCount: number = 0
) {
  const userId = await getUserId()

  const documentId = generateId()

  await db.insert(document).values({
    id: documentId,
    userId,
    title,
    description,
    fileName,
    fileSize,
    blobUrl,
    pageCount,
  })

  revalidatePath('/dashboard')
  return documentId
}

export async function getDocuments() {
  const userId = await getUserId()

  return db
    .select()
    .from(document)
    .where(eq(document.userId, userId))
    .orderBy(desc(document.createdAt))
}

export async function getDocument(documentId: string) {
  const userId = await getUserId()

  const result = await db
    .select()
    .from(document)
    .where(and(eq(document.id, documentId), eq(document.userId, userId)))
    .limit(1)

  if (!result.length) throw new Error('Document not found')
  return result[0]
}

export async function deleteDocument(documentId: string) {
  const userId = await getUserId()

  await db
    .delete(document)
    .where(and(eq(document.id, documentId), eq(document.userId, userId)))

  revalidatePath('/dashboard')
}

export async function updateDocument(
  documentId: string,
  title: string,
  description: string
) {
  const userId = await getUserId()

  await db
    .update(document)
    .set({ title, description })
    .where(and(eq(document.id, documentId), eq(document.userId, userId)))

  revalidatePath('/dashboard')
}

export async function getDocumentSummaries(documentId: string) {
  const userId = await getUserId()

  return db
    .select()
    .from(summary)
    .where(
      and(
        eq(summary.documentId, documentId),
        eq(summary.userId, userId)
      )
    )
    .orderBy(desc(summary.createdAt))
}

export async function getDocumentFlashcards(documentId: string) {
  const userId = await getUserId()

  return db
    .select()
    .from(flashcard)
    .where(
      and(
        eq(flashcard.documentId, documentId),
        eq(flashcard.userId, userId)
      )
    )
    .orderBy(desc(flashcard.createdAt))
}

export async function getDocumentQuizzes(documentId: string) {
  const userId = await getUserId()

  return db
    .select()
    .from(quiz)
    .where(
      and(
        eq(quiz.documentId, documentId),
        eq(quiz.userId, userId)
      )
    )
    .orderBy(desc(quiz.createdAt))
}
