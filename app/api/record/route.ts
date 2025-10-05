import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('audio') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const fileName = `${userId || 'anonymous'}_${Date.now()}.webm`
    const { data, error } = await supabase.storage
      .from('recordings')
      .upload(fileName, file, {
        contentType: 'audio/webm',
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('recordings')
      .getPublicUrl(fileName)

    return NextResponse.json({
      url: urlData.publicUrl,
      fileName,
      message: 'Recording uploaded successfully',
    })
  } catch (error) {
    console.error('Error in record API:', error)
    return NextResponse.json(
      { error: 'Failed to upload recording', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

