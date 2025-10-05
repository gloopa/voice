'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { LogOut, User, Library, Mic } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return null
  }

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Mic className="w-8 h-8 text-amber-600" />
            <span className="text-xl font-bold text-neutral-900">VoiceU</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/voices"
                  className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  <Library className="w-4 h-4" />
                  <span className="font-medium">My Voices</span>
                </Link>
                
                <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-neutral-500" />
                    <span className="text-neutral-700">{user.email}</span>
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

