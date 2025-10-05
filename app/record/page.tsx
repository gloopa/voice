'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RecordingPrompt from '@/components/RecordingPrompt'
import { RECORDING_PROMPTS } from '@/lib/constants'
import { saveRecordings } from '@/lib/indexeddb'

export default function RecordPage() {
  const router = useRouter()
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [recordings, setRecordings] = useState<Blob[]>([])

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
      // All recordings complete - save and move to generation
      saveRecordingsAndProceed()
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Voice Recording Session
          </h1>
          <p className="text-gray-600">
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
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Recording Tips for Maximum Quality</h3>
            <ul className="text-sm text-blue-800 space-y-1">
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
  )
}

