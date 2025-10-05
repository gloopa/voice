import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in client components
 * This client stores the session in cookies that can be read by server-side API routes
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

