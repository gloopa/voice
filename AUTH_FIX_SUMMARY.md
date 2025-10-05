# Authentication & Voice Library Fix

## Problem
Voices created by logged-in users were not appearing in the Voice Library page.

## Root Cause
The issue occurred when Row Level Security (RLS) policies were enabled on the database tables. The RLS policies check `auth.uid()` to ensure users can only see their own voices, but the Supabase client used in API routes was not authenticated with the user's session. This meant:

1. **When creating a voice**: The voice was inserted with the correct `user_id`
2. **When fetching voices**: The Supabase client had no authentication context, so `auth.uid()` was `NULL`, causing the RLS policies to reject the query

## Solution
Implemented proper server-side authentication by:

### 1. Created Server-Side Authenticated Client (`lib/supabase-server.ts`)
- Uses `@supabase/ssr` package to create an authenticated Supabase client
- Reads authentication cookies from the request
- Passes user session to Supabase queries so RLS policies work correctly

### 2. Created Browser Client (`lib/supabase-browser.ts`)
- Uses `@supabase/ssr` for browser-side authentication
- Stores sessions in cookies (not just localStorage)
- Makes sessions accessible to server-side API routes

### 3. Updated API Routes
Modified the following API routes to use authenticated Supabase clients:
- `/app/api/voices/route.ts` - GET, PATCH, DELETE operations
- `/app/api/generate-voice/route.ts` - POST operation

Changes:
- Import `createServerSupabaseClient` instead of static `supabase` client
- Get authenticated user from `supabase.auth.getUser()`
- Return 401 Unauthorized if user is not authenticated
- RLS policies automatically filter queries by the authenticated user

### 4. Updated Auth Context (`lib/auth-context.tsx`)
- Changed from static Supabase client to `createBrowserSupabaseClient()`
- Ensures authentication state is properly synced between client and server

### 5. Added Middleware (`middleware.ts`)
- Refreshes user sessions on each request
- Ensures cookies are properly set and maintained
- Required for Server Components and API routes to access auth state

### 6. Updated Frontend Components
Removed manual `userId` passing from:
- `/app/generate/page.tsx` - No longer passes `userId` to API
- `/app/voices/page.tsx` - No longer includes `userId` in query params
- `/app/dashboard/page.tsx` - No longer includes `userId` in query params

The `userId` is now automatically extracted from the authenticated session on the server side.

## Files Changed
- ✅ `lib/supabase-server.ts` (new)
- ✅ `lib/supabase-browser.ts` (new)
- ✅ `middleware.ts` (new)
- ✅ `lib/auth-context.tsx` (updated)
- ✅ `app/api/voices/route.ts` (updated)
- ✅ `app/api/generate-voice/route.ts` (updated)
- ✅ `app/generate/page.tsx` (updated)
- ✅ `app/voices/page.tsx` (updated)
- ✅ `app/dashboard/page.tsx` (updated)

## Database Setup
Ensure the RLS policies are enabled by running:
```sql
-- Run this in your Supabase SQL Editor
-- File: enable-auth-policies.sql
```

The policies will:
- Allow users to view only their own voices
- Allow users to insert voices with their own user_id
- Allow users to update only their own voices
- Allow users to delete only their own voices

## Testing
To verify the fix:
1. Sign in to the application
2. Go to the Record page and create a new voice
3. Wait for voice generation to complete
4. Navigate to the Voice Library page
5. Your newly created voice should now appear in the list

## Dependencies Added
- `@supabase/ssr` - Required for server-side authentication with cookies

