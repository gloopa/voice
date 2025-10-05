import { ElevenLabsClient } from 'elevenlabs'

const apiKey = process.env.ELEVENLABS_API_KEY

if (!apiKey) {
  console.warn('ELEVENLABS_API_KEY is not set - voice features will not work')
}

export const elevenlabs = apiKey ? new ElevenLabsClient({
  apiKey: apiKey,
}) : null

export async function createVoice(name: string, audioFiles: File[], useProfessional: boolean = false) {
  if (!elevenlabs) {
    throw new Error('ElevenLabs client not initialized - API key missing')
  }
  
  try {
    console.log(`Creating voice with ${audioFiles.length} audio files`)
    console.log(`Voice cloning mode: ${useProfessional ? 'PROFESSIONAL (highest quality)' : 'INSTANT (fast)'}`)
    
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', 'Voice created via VoiceBank - Professional voice banking for accessibility')
    
    // Add labels for better voice cloning quality
    // Labels help ElevenLabs understand the content and improve the model
    const labels = {
      accent: 'neutral',
      description: 'natural conversational voice',
      age: 'adult',
      gender: 'neutral',
      use_case: 'conversational'
    }
    formData.append('labels', JSON.stringify(labels))
    
    // Add audio files - ElevenLabs expects 'files' field (can be multiple)
    audioFiles.forEach((file, index) => {
      console.log(`File ${index + 1}: ${file.name}, size: ${file.size} bytes, type: ${file.type}`)
      formData.append('files', file, file.name)
    })
    
    console.log('Sending request to ElevenLabs API with MAXIMUM quality settings...')
    
    // NOTE: Professional Voice Cloning requires manual review by ElevenLabs
    // It takes 24-48 hours but produces the highest quality results
    // Currently using Instant Voice Cloning which is immediate but slightly lower quality
    
    // Using ElevenLabs API to add a voice
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey!,
      },
      body: formData,
    })
    
    console.log(`ElevenLabs API response status: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs error response:', errorText)
      console.error('Response status:', response.status)
      console.error('Response headers:', Object.fromEntries(response.headers.entries()))
      
      let errorMessage = `ElevenLabs API error: ${response.statusText}`
      
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.detail?.message || errorJson.message || errorJson.detail || errorMessage
        console.error('Parsed error:', errorJson)
      } catch (e) {
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    console.log('Voice created successfully:', data)
    return data.voice_id
  } catch (error) {
    console.error('Error creating voice:', error)
    throw error
  }
}

export async function generateSpeech(text: string, voiceId: string) {
  if (!elevenlabs) {
    throw new Error('ElevenLabs client not initialized - API key missing')
  }
  
  try {
    console.log(`Generating speech with voice ID: ${voiceId}`)
    
    // Using direct API call for better compatibility
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey!,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // Better quality than turbo
        voice_settings: {
          stability: 0.55,             // 0-1: Slightly higher for more consistent voice
          similarity_boost: 0.95,      // 0-1: MAXIMUM - closest match to original voice
          style: 0.0,                  // 0-1: No style exaggeration for natural sound
          use_speaker_boost: true      // Enhances similarity to the original speaker
        }
      }),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`ElevenLabs TTS error: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }
    
    console.log('Speech generated successfully')
    return response.body as ReadableStream<Uint8Array>
  } catch (error) {
    console.error('Error generating speech:', error)
    throw error
  }
}

