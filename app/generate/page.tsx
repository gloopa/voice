'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'
import { getRecordings } from '@/lib/indexeddb'

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
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [voiceId, setVoiceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateVoice()
  }, [])

  const generateVoice = async () => {
    try {
      // Get recordings from IndexedDB
      console.log('Loading recordings from IndexedDB...')
      const recordingBlobs = await getRecordings()
      
      if (!recordingBlobs || recordingBlobs.length === 0) {
        throw new Error('No recordings found')
      }
      
      console.log(`Loaded ${recordingBlobs.length} recordings`)
      
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
        body: JSON.stringify({ recordings }),
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/record')}
            className="bg-primary-400 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
            {voiceId ? (
              <Check className="w-10 h-10 text-primary-400" />
            ) : (
              <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {voiceId ? '✨ Your Voice is Ready!' : '🔮 Creating Your Voice...'}
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-primary-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600 font-medium">
            {progress}%
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {GENERATION_STEPS.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : index === currentStep ? (
                <Loader2 className="w-5 h-5 text-primary-400 animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
              )}
              <span className={index <= currentStep ? 'font-medium' : ''}>{step}</span>
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="text-center text-gray-600">
          {voiceId ? (
            <p className="font-medium">Redirecting to your dashboard...</p>
          ) : (
            <>
              <p className="mb-1">Takes 5-8 minutes. Grab a coffee ☕</p>
              <p className="text-sm">Don't close this window</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

