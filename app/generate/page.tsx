'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'
import { getRecordings } from '@/lib/indexeddb'
import { useAuth } from '@/lib/auth-context'

const GENERATION_STEPS = [
  'Processing audio files...',
  'Analyzing tone and pitch patterns...',
  'Learning speech rhythm...',
  'Capturing emotional inflections...',
  'Understanding pronunciation style...',
  'Finalizing your voice model...',
]

export default function GeneratePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [voiceId, setVoiceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hasStartedGeneration = useRef(false)

  useEffect(() => {
    if (!authLoading && !user) {
      alert('Please sign in to create a voice')
      router.push('/auth')
      return
    }
    
    // Prevent duplicate API calls (React Strict Mode runs effects twice in dev)
    if (user && !hasStartedGeneration.current) {
      hasStartedGeneration.current = true
      generateVoice()
    }
  }, [user, authLoading, router])

  const generateVoice = async () => {
    try {
      // Get recordings from IndexedDB
      console.log('Loading recordings from IndexedDB...')
      const recordingBlobs = await getRecordings()
      
      if (!recordingBlobs || recordingBlobs.length === 0) {
        throw new Error('No recordings found')
      }
      
      console.log(`Loaded ${recordingBlobs.length} recordings`)
      
      // Get voice name from sessionStorage (set in record page)
      const voiceName = sessionStorage.getItem('newVoiceName') || undefined
      
      // Convert blobs to data URLs for API
      const recordings = await Promise.all(
        recordingBlobs.map(async (blob) => {
          const reader = new FileReader()
          return new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = () => reject(new Error('Failed to read recording'))
            reader.readAsDataURL(blob)
          })
        })
      )

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 1
        })

        setCurrentStep((prev) => {
          const step = Math.floor((progress / 100) * GENERATION_STEPS.length)
          return Math.min(step, GENERATION_STEPS.length - 1)
        })
      }, 500)

      // Call API to generate voice
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          recordings,
          voiceName
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate voice')
      }

      const data = await response.json()
      
      clearInterval(progressInterval)
      setProgress(100)
      setCurrentStep(GENERATION_STEPS.length - 1)
      setVoiceId(data.voiceId)

      // Store voice ID and redirect after a brief pause
      sessionStorage.setItem('voiceId', data.voiceId)
      sessionStorage.setItem('voiceName', data.name || 'Your Voice')
      sessionStorage.setItem('dbVoiceId', data.dbId || '')
      
      // Clear the temp voice name
      sessionStorage.removeItem('newVoiceName')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      console.error('Error generating voice:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-neutral-200">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-3">Generation Failed</h2>
          <p className="text-neutral-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => router.push('/record')}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-neutral-200">
            {/* Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 rounded-2xl mb-4">
                {voiceId ? (
                  <Check className="w-10 h-10 text-amber-600" />
                ) : (
                  <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">
                {voiceId ? '✨ Your Voice is Ready!' : '🔮 Creating Your Voice...'}
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-neutral-100 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-center text-sm text-neutral-600 font-semibold">
                {progress}%
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
              {GENERATION_STEPS.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 ${
                    index <= currentStep ? 'text-neutral-900' : 'text-neutral-400'
                  }`}
                >
                  {index < currentStep ? (
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                  ) : index === currentStep ? (
                    <Loader2 className="w-5 h-5 text-amber-600 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-neutral-200 rounded-full flex-shrink-0" />
                  )}
                  <span className={index <= currentStep ? 'font-medium' : ''}>{step}</span>
                </div>
              ))}
            </div>

            {/* Message */}
            <div className="text-center text-neutral-600 pt-4 border-t border-neutral-200">
              {voiceId ? (
                <p className="font-medium">Redirecting to your dashboard...</p>
              ) : (
                <>
                  <p className="mb-1">Takes 5-8 minutes. Grab a coffee ☕</p>
                  <p className="text-sm text-neutral-500">Don't close this window</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

