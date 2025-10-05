import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// Get all voices (optionally filtered by user)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient(request)
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Query voices for the authenticated user
    // RLS policies will automatically filter by auth.uid()
    const { data, error } = await supabase
      .from('voices')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ voices: data || [] })
  } catch (error) {
    console.error('Error fetching voices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voices', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Update a voice
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient(request)
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, name, is_active } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Voice ID is required' },
        { status: 400 }
      )
    }

    const updates: any = {}
    if (name !== undefined) updates.name = name
    if (is_active !== undefined) updates.is_active = is_active

    // RLS policies will automatically ensure user can only update their own voices
    const { data, error } = await supabase
      .from('voices')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ voice: data, message: 'Voice updated successfully' })
  } catch (error) {
    console.error('Error updating voice:', error)
    return NextResponse.json(
      { error: 'Failed to update voice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Delete a voice
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient(request)
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Voice ID is required' },
        { status: 400 }
      )
    }

    // Soft delete - just mark as inactive
    // RLS policies will automatically ensure user can only delete their own voices
    const { error } = await supabase
      .from('voices')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Voice deleted successfully' })
  } catch (error) {
    console.error('Error deleting voice:', error)
    return NextResponse.json(
      { error: 'Failed to delete voice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

