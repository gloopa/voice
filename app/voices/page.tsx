'use client'

import { useState, useEffect } from 'react'
import { Mic, Trash2, Edit2, Calendar, Plus, Loader2 } from 'lucide-react'
import { Voice } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'

export default function VoicesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [voices, setVoices] = useState<Voice[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
      return
    }
    
    if (user) {
      loadVoices()
    }
  }, [user, authLoading, router])

  const loadVoices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/voices')
      
      if (!response.ok) {
        throw new Error('Failed to fetch voices')
      }
      
      const data = await response.json()
      setVoices(data.voices || [])
    } catch (error) {
      console.error('Error loading voices:', error)
      alert('Failed to load voices')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/voices?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete voice')
      }

      // Remove from local state
      setVoices(voices.filter(v => v.id !== id))
      alert('Voice deleted successfully')
    } catch (error) {
      console.error('Error deleting voice:', error)
      alert('Failed to delete voice')
    }
  }

  const handleRename = async (id: string) => {
    if (!editName.trim()) {
      alert('Please enter a name')
      return
    }

    try {
      const response = await fetch('/api/voices', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name: editName }),
      })

      if (!response.ok) {
        throw new Error('Failed to rename voice')
      }

      // Update local state
      setVoices(voices.map(v => 
        v.id === id ? { ...v, name: editName } : v
      ))
      setEditingId(null)
      setEditName('')
    } catch (error) {
      console.error('Error renaming voice:', error)
      alert('Failed to rename voice')
    }
  }

  const startEditing = (voice: Voice) => {
    setEditingId(voice.id)
    setEditName(voice.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditName('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSelectVoice = (voice: Voice) => {
    // Store voice info and redirect to dashboard
    sessionStorage.setItem('voiceId', voice.voice_id)
    sessionStorage.setItem('voiceName', voice.name)
    sessionStorage.setItem('dbVoiceId', voice.id)
    router.push('/dashboard')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-neutral-900 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading your voices...</p>
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
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">Voice Library</h1>
          <p className="text-xl text-neutral-600">
            Manage your preserved voices
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-neutral-600">
            <span className="text-2xl font-bold text-neutral-900">{voices.length}</span> {voices.length === 1 ? 'voice' : 'voices'} saved
          </div>
          <button
            onClick={() => router.push('/record')}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Record New Voice
          </button>
        </div>

        {/* Voices List */}
        {voices.length === 0 ? (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl opacity-50"></div>
            <div className="relative bg-white rounded-3xl shadow-xl p-12 text-center border border-neutral-200">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
                <Mic className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">No Voices Yet</h2>
              <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
                Start by recording your first voice to preserve it forever.
              </p>
              <button
                onClick={() => router.push('/record')}
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Record Your First Voice
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {voices.map((voice) => (
              <div
                key={voice.id}
                className="relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-br from-amber-50/50 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-neutral-200">
                  <div className="flex items-start justify-between gap-4">
                    {/* Voice Info */}
                    <div className="flex-1">
                      {editingId === voice.id ? (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-neutral-900 rounded-xl focus:outline-none text-black"
                            placeholder="Voice name"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRename(voice.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Mic className="w-5 h-5 text-amber-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-neutral-900">{voice.name}</h3>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>Created {formatDate(voice.created_at)}</span>
                      </div>

                      <div className="text-xs text-neutral-400 font-mono">
                        Voice ID: {voice.voice_id}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleSelectVoice(voice)}
                        className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold transition-colors"
                      >
                        Use Voice
                      </button>
                      <button
                        onClick={() => startEditing(voice)}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-xl font-semibold transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(voice.id, voice.name)}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-neutral-600 hover:text-neutral-900 font-semibold transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

