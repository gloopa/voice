'use client'

import { useState } from 'react'
import { Check, ChevronDown, Mic, Calendar } from 'lucide-react'
import { Voice } from '@/lib/supabase'

interface VoiceSelectorProps {
  voices: Voice[]
  selectedVoice: Voice | null
  onSelectVoice: (voice: Voice) => void
  className?: string
}

export default function VoiceSelector({ 
  voices, 
  selectedVoice, 
  onSelectVoice,
  className = ''
}: VoiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (voices.length === 0) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <p className="text-yellow-800 text-sm">
          No voices found. <a href="/record" className="font-semibold underline">Record your first voice →</a>
        </p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Select Voice
      </label>
      
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-primary-400 focus:border-primary-400 focus:outline-none transition-colors"
      >
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-primary-400" />
          <div className="text-left">
            <div className="font-semibold text-gray-900">
              {selectedVoice?.name || 'Select a voice'}
            </div>
            {selectedVoice && (
              <div className="text-xs text-gray-500">
                Created {formatDate(selectedVoice.created_at)}
              </div>
            )}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
            {voices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => {
                  onSelectVoice(voice)
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <Mic className="w-4 h-4 text-primary-400" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      {voice.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(voice.created_at)}
                    </div>
                  </div>
                </div>
                {selectedVoice?.id === voice.id && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

