'use client'

import { useState, useEffect } from 'react'
import { Mic, Download, Save, Share2, Trash2 } from 'lucide-react'
import VoicePlayer from '@/components/VoicePlayer'
import { SUGGESTED_PHRASES } from '@/lib/constants'
import { downloadAudio } from '@/lib/audio-processor'

interface SavedPhrase {
  id: string
  text: string
  audioUrl?: string
}

export default function DashboardPage() {
  const [voiceId, setVoiceId] = useState<string>('')
  const [voiceName, setVoiceName] = useState<string>('Your Voice')
  const [text, setText] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([])
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null)

  useEffect(() => {
    // Get voice info from sessionStorage
    const storedVoiceId = sessionStorage.getItem('voiceId')
    const storedVoiceName = sessionStorage.getItem('voiceName')
    
    if (storedVoiceId) {
      setVoiceId(storedVoiceId)
    }
    if (storedVoiceName) {
      setVoiceName(storedVoiceName)
    }

    // Load saved phrases from localStorage
    const stored = localStorage.getItem('savedPhrases')
    if (stored) {
      setSavedPhrases(JSON.parse(stored))
    }
  }, [])

  const handleSpeak = async () => {
    if (!text.trim() || !voiceId) {
      alert('Please enter some text and ensure your voice is loaded')
      return
    }

    setIsPlaying(true)

    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voiceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate speech')
      }

      const audioBlob = await response.blob()
      setLastAudioBlob(audioBlob)
      
      // Play the audio
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
      
      audio.play()
    } catch (error) {
      console.error('Error generating speech:', error)
      alert('Failed to generate speech. Please try again.')
      setIsPlaying(false)
    }
  }

  const handleSavePhrase = () => {
    if (!text.trim()) return

    const newPhrase: SavedPhrase = {
      id: Date.now().toString(),
      text: text.trim(),
    }

    const updated = [...savedPhrases, newPhrase]
    setSavedPhrases(updated)
    localStorage.setItem('savedPhrases', JSON.stringify(updated))
    
    alert('Phrase saved!')
  }

  const handleDeletePhrase = (id: string) => {
    const updated = savedPhrases.filter(p => p.id !== id)
    setSavedPhrases(updated)
    localStorage.setItem('savedPhrases', JSON.stringify(updated))
  }

  const handleDownload = () => {
    if (lastAudioBlob) {
      downloadAudio(lastAudioBlob, `voicebank-${Date.now()}.mp3`)
    } else {
      alert('Please generate speech first')
    }
  }

  const handleSuggestedPhrase = (phrase: string) => {
    setText(phrase)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mic className="w-10 h-10 text-primary-400" />
            <h1 className="text-4xl font-bold text-gray-900">VoiceBank</h1>
          </div>
          <p className="text-xl text-gray-600">{voiceName}</p>
        </div>

        {/* Main Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              What do you want to say?
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message here..."
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-400 focus:outline-none resize-none text-lg"
              disabled={isPlaying}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <VoicePlayer
              isPlaying={isPlaying}
              onPlay={handleSpeak}
              disabled={!text.trim() || !voiceId}
            />
            
            <button
              onClick={handleSavePhrase}
              disabled={!text.trim() || isPlaying}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-full shadow-lg transition-all"
            >
              <Save className="w-5 h-5" />
              Save Phrase
            </button>

            <button
              onClick={handleDownload}
              disabled={!lastAudioBlob || isPlaying}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-full shadow-lg transition-all"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>

          {/* Suggested Phrases */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">💬 Quick Phrases:</h3>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PHRASES.map((phrase, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPhrase(phrase)}
                  disabled={isPlaying}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Phrases */}
        {savedPhrases.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📌 Saved Phrases</h2>
            <div className="space-y-3">
              {savedPhrases.map((phrase) => (
                <div
                  key={phrase.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => setText(phrase.text)}
                    className="text-left flex-1 text-gray-800 hover:text-primary-400 transition-colors"
                  >
                    "{phrase.text}"
                  </button>
                  <button
                    onClick={() => handleDeletePhrase(phrase.id)}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-900 mb-2">
            <strong>Your voice has been preserved!</strong>
          </p>
          <p className="text-blue-800 text-sm">
            Type any message and hear it in your voice. Save your favorite phrases for quick access.
          </p>
        </div>
      </div>
    </div>
  )
}

