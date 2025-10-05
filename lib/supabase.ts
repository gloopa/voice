import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Voice {
  id: string
  user_id?: string
  voice_id: string
  name: string
  created_at: string
  recording_urls: string[]
  is_active: boolean
}

export interface SavedPhrase {
  id: string
  voice_id: string
  text: string
  category?: string
  audio_url?: string
  created_at: string
}

export interface SharedAccess {
  id: string
  voice_id: string
  share_token: string
  created_at: string
  expires_at?: string
  access_count: number
}

