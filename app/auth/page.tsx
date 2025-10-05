'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Mic, Loader2 } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        router.push('/voices')
      } else {
        await signUp(email, password)
        setError('Check your email to confirm your account!')
        setTimeout(() => {
          setIsLogin(true)
          setError('')
        }, 3000)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-neutral-200">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Mic className="w-10 h-10 text-amber-600" />
                <h1 className="text-3xl font-bold text-neutral-900">VoiceU</h1>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-neutral-600">
                {isLogin 
                  ? 'Sign in to access your voices' 
                  : 'Sign up to preserve your voice forever'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
                  required
                  minLength={6}
                />
                {!isLogin && (
                  <p className="text-xs text-neutral-500 mt-1">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              {error && (
                <div className={`p-3 rounded-xl ${
                  error.includes('email') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-neutral-700 hover:text-neutral-900 font-semibold"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-neutral-500 hover:text-neutral-700 text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

