'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RecordingPrompt from '@/components/RecordingPrompt'
import { RECORDING_PROMPTS } from '@/lib/constants'
import { saveRecordings } from '@/lib/indexeddb'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'

export default function RecordPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [recordings, setRecordings] = useState<Blob[]>([])
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [voiceName, setVoiceName] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      alert('Please sign in to record a voice')
      router.push('/auth')
    }
  }, [user, authLoading, router])

  const handleComplete = (audioBlob: Blob) => {
    // Update recordings array with the new recording
    const newRecordings = [...recordings]
    newRecordings[currentPrompt] = audioBlob
    setRecordings(newRecordings)
  }

  const handleNext = () => {
    if (currentPrompt < RECORDING_PROMPTS.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    } else {
      // All recordings complete - show name dialog
      setShowNameDialog(true)
    }
  }

  const handleNameSubmit = () => {
    const finalName = voiceName.trim() || `My Voice - ${new Date().toLocaleDateString()}`
    sessionStorage.setItem('newVoiceName', finalName)
    setShowNameDialog(false)
    saveRecordingsAndProceed()
  }

  const saveRecordingsAndProceed = async () => {
    try {
      console.log('Total recordings:', recordings.length)
      
      // Filter out any undefined/null recordings
      const validRecordings = recordings.filter(blob => blob != null)
      console.log('Valid recordings:', validRecordings.length)
      
      if (validRecordings.length === 0) {
        throw new Error('No valid recordings found')
      }
      
      // Log file sizes
      const totalSize = validRecordings.reduce((sum, blob) => sum + blob.size, 0)
      console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
      
      // Store recordings in IndexedDB (can handle large files, unlike sessionStorage)
      console.log('Saving recordings to IndexedDB...')
      await saveRecordings(validRecordings)
      console.log('Recordings saved successfully!')
      
      router.push('/generate')
    } catch (error) {
      console.error('Error saving recordings:', error)
      alert('There was an error saving your recordings. Please try again.')
    }
  }

  const prompt = RECORDING_PROMPTS[currentPrompt]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white">
      <Navigation />
      <div className="py-12 px-4">
      <div className="container mx-auto">
        {/* Name Dialog */}
        {showNameDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-neutral-200">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                Name Your Voice
              </h2>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                Give your voice a memorable name so you can easily find it later.
              </p>
              <input
                type="text"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="e.g., My Voice, Mom's Voice"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none mb-6 text-black"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNameDialog(false)}
                  className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNameSubmit}
                  className="flex-1 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/50 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <span className="text-sm font-medium text-amber-900">Recording in progress</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Voice Recording Session
          </h1>
          <p className="text-xl text-neutral-600">
            Take your time with each prompt. Speak naturally and clearly.
          </p>
        </div>

        {/* Recording Prompt */}
        <RecordingPrompt
          key={currentPrompt}
          promptNumber={currentPrompt + 1}
          totalPrompts={RECORDING_PROMPTS.length}
          title={prompt.title}
          description={prompt.description}
          duration={prompt.duration}
          readingText={prompt.readingText}
          phrases={prompt.phrases}
          onComplete={handleComplete}
          onNext={handleNext}
        />

        {/* Tips */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
            <div className="relative bg-white/80 backdrop-blur rounded-2xl p-6 border border-amber-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg mb-3">Recording Tips for Maximum Quality</h3>
                  <ul className="text-neutral-700 space-y-2 leading-relaxed">
                    <li>• <strong>Find a QUIET space</strong> - No background noise (critical!)</li>
                    <li>• <strong>Record 30-60 seconds per prompt</strong> - Longer = better quality</li>
                    <li>• <strong>Position yourself 6-12 inches from microphone</strong></li>
                    <li>• <strong>Speak naturally with emotion</strong> - Don't read in monotone</li>
                    <li>• <strong>Listen to each recording</strong> - Re-record if there's noise</li>
                    <li>• ⏱️ Total recording time: Aim for 8-12 minutes across all prompts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

