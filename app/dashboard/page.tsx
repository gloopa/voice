'use client'

import { useState, useEffect } from 'react'
import { Mic, Download, Save, Share2, Trash2, Library } from 'lucide-react'
import { useRouter } from 'next/navigation'
import VoicePlayer from '@/components/VoicePlayer'
import VoiceSelector from '@/components/VoiceSelector'
import Navigation from '@/components/Navigation'
import { SUGGESTED_PHRASES } from '@/lib/constants'
import { downloadAudio } from '@/lib/audio-processor'
import { Voice } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface SavedPhrase {
  id: string
  text: string
  audioUrl?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [voiceId, setVoiceId] = useState<string>('')
  const [voiceName, setVoiceName] = useState<string>('Your Voice')
  const [text, setText] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([])
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null)
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null)
  const [loadingVoices, setLoadingVoices] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
      return
    }
    
    if (user) {
      loadVoices()
    }
    
    // Get voice info from sessionStorage (fallback)
    const storedVoiceId = sessionStorage.getItem('voiceId')
    const storedVoiceName = sessionStorage.getItem('voiceName')
    
    if (storedVoiceId) {
      setVoiceId(storedVoiceId)
    }
    if (storedVoiceName) {
      setVoiceName(storedVoiceName)
    }
  }, [user, authLoading, router])

  // Load saved phrases when voice changes
  useEffect(() => {
    if (user && voiceId) {
      // Load saved phrases from localStorage (user + voice specific)
      const stored = localStorage.getItem(`savedPhrases_${user.id}_${voiceId}`)
      if (stored) {
        setSavedPhrases(JSON.parse(stored))
      } else {
        setSavedPhrases([])
      }
    }
  }, [user, voiceId])

  const loadVoices = async () => {
    try {
      setLoadingVoices(true)
      const response = await fetch('/api/voices')
      
      if (!response.ok) {
        throw new Error('Failed to fetch voices')
      }
      
      const data = await response.json()
      setVoices(data.voices || [])

      // Auto-select the most recent voice if no voice is selected
      if (data.voices && data.voices.length > 0) {
        const storedDbVoiceId = sessionStorage.getItem('dbVoiceId')
        const voiceToSelect = storedDbVoiceId 
          ? data.voices.find((v: Voice) => v.id === storedDbVoiceId) || data.voices[0]
          : data.voices[0]
        
        setSelectedVoice(voiceToSelect)
        setVoiceId(voiceToSelect.voice_id)
        setVoiceName(voiceToSelect.name)
      }
    } catch (error) {
      console.error('Error loading voices:', error)
    } finally {
      setLoadingVoices(false)
    }
  }

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice)
    setVoiceId(voice.voice_id)
    setVoiceName(voice.name)
    
    // Store in sessionStorage for persistence
    sessionStorage.setItem('voiceId', voice.voice_id)
    sessionStorage.setItem('voiceName', voice.name)
    sessionStorage.setItem('dbVoiceId', voice.id)
  }

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
    if (!text.trim() || !user || !voiceId) return

    const newPhrase: SavedPhrase = {
      id: Date.now().toString(),
      text: text.trim(),
    }

    const updated = [...savedPhrases, newPhrase]
    setSavedPhrases(updated)
    localStorage.setItem(`savedPhrases_${user.id}_${voiceId}`, JSON.stringify(updated))
    
    alert('Phrase saved!')
  }

  const handleDeletePhrase = (id: string) => {
    if (!user || !voiceId) return
    
    const updated = savedPhrases.filter(p => p.id !== id)
    setSavedPhrases(updated)
    localStorage.setItem(`savedPhrases_${user.id}_${voiceId}`, JSON.stringify(updated))
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white">
      <Navigation />
      <div className="container mx-auto max-w-4xl py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">{voiceName}</h1>
          <div className="flex items-center justify-center gap-4">
            <p className="text-lg text-neutral-600">Generate speech with your voice</p>
            <button
              onClick={() => router.push('/voices')}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-sm font-semibold transition-colors"
            >
              <Library className="w-4 h-4" />
              Voice Library
            </button>
          </div>
        </div>

        {/* Voice Selector */}
        {!loadingVoices && voices.length > 0 && (
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
            <div className="relative bg-white rounded-3xl shadow-xl p-6 border border-neutral-200">
              <VoiceSelector
                voices={voices}
                selectedVoice={selectedVoice}
                onSelectVoice={handleVoiceSelect}
              />
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
          <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-neutral-200">
            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-neutral-900 mb-3">
                What do you want to say?
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-32 px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none resize-none text-lg text-black"
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
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-xl shadow-lg transition-all"
              >
                <Save className="w-5 h-5" />
                Save Phrase
              </button>

              <button
                onClick={handleDownload}
                disabled={!lastAudioBlob || isPlaying}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-xl shadow-lg transition-all"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>

            {/* Suggested Phrases */}
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-600 mb-3">💬 Quick Phrases:</h3>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PHRASES.map((phrase, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPhrase(phrase)}
                    disabled={isPlaying}
                    className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Saved Phrases */}
        {savedPhrases.length > 0 && (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
            <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">📌 Saved Phrases</h2>
              <div className="space-y-3">
                {savedPhrases.map((phrase) => (
                  <div
                    key={phrase.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors border border-neutral-200"
                  >
                    <button
                      onClick={() => setText(phrase.text)}
                      className="text-left flex-1 text-neutral-800 hover:text-neutral-900 transition-colors"
                    >
                      "{phrase.text}"
                    </button>
                    <button
                      onClick={() => handleDeletePhrase(phrase.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
          <div className="relative bg-white/80 backdrop-blur rounded-2xl p-6 text-center border border-amber-100">
            <p className="text-neutral-900 mb-2 font-semibold">
              Your voice has been preserved!
            </p>
            <p className="text-neutral-600">
              Type any message and hear it in your voice. Save your favorite phrases for quick access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

