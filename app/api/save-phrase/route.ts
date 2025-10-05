import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { voiceId, text, category, audioUrl } = await request.json()

    if (!voiceId || !text) {
      return NextResponse.json(
        { error: 'Voice ID and text are required' },
        { status: 400 }
      )
    }

    // Save phrase to database
    const { data, error } = await supabase
      .from('saved_phrases')
      .insert({
        voice_id: voiceId,
        text,
        category: category || 'general',
        audio_url: audioUrl,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      phrase: data,
      message: 'Phrase saved successfully',
    })
  } catch (error) {
    console.error('Error in save-phrase API:', error)
    return NextResponse.json(
      { error: 'Failed to save phrase', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const voiceId = searchParams.get('voiceId')

    if (!voiceId) {
      return NextResponse.json(
        { error: 'Voice ID is required' },
        { status: 400 }
      )
    }

    // Get all saved phrases for this voice
    const { data, error } = await supabase
      .from('saved_phrases')
      .select('*')
      .eq('voice_id', voiceId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ phrases: data })
  } catch (error) {
    console.error('Error in save-phrase API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch phrases', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

