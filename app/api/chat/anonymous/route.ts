import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `You are StudyGen AI, a helpful study assistant. The user is chatting anonymously. Be friendly, concise, and helpful for learning.

User: ${message}

Respond helpfully:`,
      temperature: 0.7,
      maxTokens: 800,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Anonymous chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
