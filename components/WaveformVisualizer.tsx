'use client'

import { useEffect, useRef } from 'react'

interface WaveformVisualizerProps {
  stream: MediaStream | null
}

export default function WaveformVisualizer({ stream }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!stream || !canvasRef.current) return

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    
    source.connect(analyser)
    analyser.fftSize = 256
    
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)
      
      analyser.getByteTimeDomainData(dataArray)
      
      ctx.fillStyle = 'rgb(249, 250, 251)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgb(74, 144, 226)'
      ctx.beginPath()
      
      const sliceWidth = (canvas.width * 1.0) / bufferLength
      let x = 0
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        
        x += sliceWidth
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }
    
    draw()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      audioContext.close()
    }
  }, [stream])

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={100}
      className="w-full h-24 bg-gray-50 rounded"
    />
  )
}

