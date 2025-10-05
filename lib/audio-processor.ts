// Audio processing utilities

export async function preprocessAudio(audioBlobs: Blob[]): Promise<File[]> {
  // Convert blobs to files for API upload
  const files = audioBlobs.map((blob, index) => {
    return new File([blob], `recording_${index + 1}.mp3`, { type: 'audio/mp3' })
  })
  
  return files
}

export function downloadAudio(audioBlob: Blob, filename: string) {
  const url = URL.createObjectURL(audioBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

