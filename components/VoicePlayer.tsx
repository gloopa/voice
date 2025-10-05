'use client'

import { Volume2, Loader2 } from 'lucide-react'

interface VoicePlayerProps {
  isPlaying: boolean
  onPlay: () => void
  disabled?: boolean
}

export default function VoicePlayer({ isPlaying, onPlay, disabled }: VoicePlayerProps) {
  return (
    <button
      onClick={onPlay}
      disabled={disabled || isPlaying}
      className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all"
    >
      {isPlaying ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Speaking...
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5" />
          Speak
        </>
      )}
    </button>
  )
}

