'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, RotateCcw, Check } from 'lucide-react'
import WaveformVisualizer from './WaveformVisualizer'

interface RecordingPromptProps {
  promptNumber: number
  totalPrompts: number
  title: string
  description: string
  duration: string
  readingText?: string
  phrases?: string[]
  onComplete: (audioBlob: Blob) => void
  onNext: () => void
}

export default function RecordingPrompt({
  promptNumber,
  totalPrompts,
  title,
  description,
  duration,
  readingText,
  phrases,
  onComplete,
  onNext,
}: RecordingPromptProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [stream, setStream] = useState<MediaStream | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recordingTimeRef = useRef<number>(0) // Track actual recording time

  useEffect(() => {
    return () => {
      // Cleanup only the stream, not the timer
      // Timer is managed separately in startRecording/stopRecording
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])
  
  useEffect(() => {
    // Cleanup timer on unmount only
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,          // Disable for more natural voice
          noiseSuppression: false,          // Disable to preserve voice characteristics
          autoGainControl: false,           // Keep natural volume levels
          sampleRate: 48000,                // Higher quality sample rate
          channelCount: 1,                  // Mono is fine for voice
        }
      })
      setStream(mediaStream)
      
      // Try to use a compatible format
      let mimeType = 'audio/webm'
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus'
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4'
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus'
      }
      
      const mediaRecorder = new MediaRecorder(mediaStream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setAudioBlob(blob)
        onComplete(blob)
        mediaStream.getTracks().forEach(track => track.stop())
      }

      // Start recording with timeslice to ensure data is collected
      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setRecordingTime(0)
      recordingTimeRef.current = 0

      // Start timer
      console.log('Starting timer...')
      timerRef.current = setInterval(() => {
        recordingTimeRef.current += 1
        console.log('Timer tick:', recordingTimeRef.current)
        setRecordingTime(recordingTimeRef.current)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to record your voice.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Use ref to get the actual current recording time
      const currentTime = recordingTimeRef.current
      console.log('Stop recording clicked. Current time from ref:', currentTime)
      console.log('State recordingTime:', recordingTime)
      
      // Check minimum recording length (30 seconds for quality)
      if (currentTime < 30) {
        const shouldContinue = window.confirm(
          `For best voice quality, we recommend recording for at least 30 seconds.\n\n` +
          `You've recorded ${currentTime} seconds.\n\n` +
          `Continue recording for better results?`
        )
        if (shouldContinue) {
          return // Don't stop, keep recording
        }
      }
      
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const reRecord = () => {
    setAudioBlob(null)
    setRecordingTime(0)
    recordingTimeRef.current = 0
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {promptNumber} of {totalPrompts}
          </span>
          <span className="text-sm text-gray-500">{duration}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(promptNumber / totalPrompts) * 100}%` }}
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>

      {/* Description */}
      <p className="text-xl text-gray-700 mb-6">{description}</p>

      {/* Reading Text */}
      {readingText && (
        <div className="bg-gray-50 border-l-4 border-primary-400 p-4 mb-6 rounded">
          <p className="text-gray-800 leading-relaxed">{readingText}</p>
        </div>
      )}

      {/* Phrases List */}
      {phrases && (
        <div className="bg-gray-50 p-4 mb-6 rounded">
          <ul className="space-y-2">
            {phrases.map((phrase, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-800">
                <span className="text-primary-400">•</span>
                "{phrase}"
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instruction */}
      <div className="text-center mb-6">
        <p className="text-gray-600 italic mb-2">
          Take your time. Speak naturally.
        </p>
        <p className="text-sm font-semibold text-blue-600">
          ⏱️ Aim for 30-60 seconds per prompt for best quality!
        </p>
      </div>

      {/* Recording Interface */}
      <div className="text-center mb-6">
        {isRecording && (
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 text-red-500 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-lg font-medium">Recording... ({formatTime(recordingTime)})</span>
            </div>
            {/* Quality indicator */}
            {recordingTime < 20 && (
              <p className="text-sm text-orange-600 mb-2">Keep going... (aim for 30+ seconds)</p>
            )}
            {recordingTime >= 20 && recordingTime < 30 && (
              <p className="text-sm text-yellow-600 mb-2">Good! (30+ seconds recommended)</p>
            )}
            {recordingTime >= 30 && recordingTime < 45 && (
              <p className="text-sm text-green-600 mb-2">✓ Great quality!</p>
            )}
            {recordingTime >= 45 && (
              <p className="text-sm text-green-700 font-semibold mb-2">✓✓ Excellent quality!</p>
            )}
            <WaveformVisualizer stream={stream} />
          </div>
        )}

        {audioBlob && !isRecording && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">Recording complete! ({formatTime(recordingTime)})</span>
            </div>
            <audio 
              src={URL.createObjectURL(audioBlob)} 
              controls 
              className="w-full mt-2"
              preload="auto"
              onError={(e) => {
                console.error('Audio playback error:', e)
                console.log('Audio blob size:', audioBlob.size, 'bytes')
                console.log('Audio blob type:', audioBlob.type)
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              {(audioBlob.size / 1024).toFixed(1)}KB • {audioBlob.type}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </button>
        )}

        {audioBlob && !isRecording && (
          <>
            <button
              onClick={reRecord}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Re-record
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
            >
              <Check className="w-5 h-5" />
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  )
}

