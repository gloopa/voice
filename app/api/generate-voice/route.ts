import { NextRequest, NextResponse } from 'next/server'
import { createVoice } from '@/lib/elevenlabs'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient(request)
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to create a voice' },
        { status: 401 }
      )
    }

    const { recordings, voiceName } = await request.json()

    if (!recordings || !Array.isArray(recordings) || recordings.length === 0) {
      return NextResponse.json(
        { error: 'No recordings provided' },
        { status: 400 }
      )
    }

    console.log(`Processing ${recordings.length} recordings...`)

    // Convert base64 data URLs back to Files
    const audioFiles = await Promise.all(
      recordings.map(async (dataUrl: string, index: number) => {
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        
        // Detect the actual mime type from the data URL
        const mimeMatch = dataUrl.match(/^data:([^;]+);/)
        const mimeType = mimeMatch ? mimeMatch[1] : 'audio/webm'
        
        // Determine file extension
        let extension = 'webm'
        if (mimeType.includes('mp4')) extension = 'mp4'
        else if (mimeType.includes('ogg')) extension = 'ogg'
        else if (mimeType.includes('wav')) extension = 'wav'
        else if (mimeType.includes('mpeg') || mimeType.includes('mp3')) extension = 'mp3'
        
        console.log(`Recording ${index + 1}: ${blob.size} bytes, type: ${mimeType}`)
        
        // ElevenLabs requires minimum audio length
        if (blob.size < 1000) {
          throw new Error(`Recording ${index + 1} is too short (${blob.size} bytes). Please record at least a few seconds of audio.`)
        }
        
        return new File([blob], `recording_${index + 1}.${extension}`, { type: mimeType })
      })
    )

    // Validate total audio
    const totalSize = audioFiles.reduce((sum, file) => sum + file.size, 0)
    console.log(`Total audio size: ${(totalSize / 1024).toFixed(2)} KB`)
    
    if (totalSize < 10000) {
      return NextResponse.json(
        { error: 'Total audio is too short. Please record more substantial audio for each prompt (at least a few seconds each).' },
        { status: 400 }
      )
    }

    // Create voice using ElevenLabs
    const finalVoiceName = voiceName || `VoiceBank_${Date.now()}`
    console.log(`Creating voice: ${finalVoiceName}`)
    
    let elevenLabsVoiceId: string
    try {
      elevenLabsVoiceId = await createVoice(finalVoiceName, audioFiles)
      console.log(`Voice created successfully: ${elevenLabsVoiceId}`)
    } catch (error: any) {
      console.error('Voice cloning failed:', error)
      console.error('Error details:', error.message)
      
      // Re-throw the error so the user knows voice cloning failed
      // Don't silently fall back to a different voice
      throw new Error(`Voice cloning failed: ${error.message}. Please check your ElevenLabs API key and subscription tier. Voice cloning requires a paid ElevenLabs plan.`)
    }

    // Save voice to database for long-term storage
    // Note: recording_urls would ideally contain Supabase Storage URLs
    // For now, we'll store empty array and can upload recordings later if needed
    const { data: voiceData, error: dbError } = await supabase
      .from('voices')
      .insert({
        user_id: user.id, // Associate with authenticated user from session
        voice_id: elevenLabsVoiceId,
        name: finalVoiceName,
        recording_urls: [],
        is_active: true,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Don't fail the request if DB save fails - voice is already created in ElevenLabs
      console.warn('Voice created in ElevenLabs but failed to save to database')
    } else {
      console.log('Voice saved to database:', voiceData)
    }

    return NextResponse.json({
      voiceId: elevenLabsVoiceId,
      dbId: voiceData?.id,
      name: finalVoiceName,
      message: 'Voice created successfully',
    })
  } catch (error) {
    console.error('Error in generate-voice API:', error)
    return NextResponse.json(
      { error: 'Failed to generate voice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

