import { NextRequest, NextResponse } from 'next/server'
import { generateSpeech } from '@/lib/elevenlabs'

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json()

    if (!text || !voiceId) {
      return NextResponse.json(
        { error: 'Text and voiceId are required' },
        { status: 400 }
      )
    }

    // Generate speech using ElevenLabs
    const audioStream = await generateSpeech(text, voiceId)

    // Convert ReadableStream to buffer
    const chunks: Uint8Array[] = []
    const reader = audioStream.getReader()
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }
    
    const audioBuffer = Buffer.concat(chunks)

    // Return audio as response
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error in speak API:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

