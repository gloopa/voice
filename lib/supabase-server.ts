import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Creates an authenticated Supabase client for use in API routes
 * This client will have access to the user's session from cookies
 */
export function createServerSupabaseClient(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Create a server client that reads cookies from the request
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // We can't set cookies in API routes directly
          // But Supabase needs this for the client to work
        },
        remove(name: string, options: CookieOptions) {
          // We can't remove cookies in API routes directly
        },
      },
    }
  )
}

