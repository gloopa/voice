// IndexedDB helper for storing large audio recordings
// SessionStorage is too small (~5-10MB), but IndexedDB can handle hundreds of MB

const DB_NAME = 'VoiceBankDB'
const STORE_NAME = 'recordings'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

export async function saveRecordings(recordings: Blob[]): Promise<void> {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  
  // Clear old recordings first
  store.clear()
  
  // Store each recording
  recordings.forEach((blob, index) => {
    store.put(blob, `recording_${index}`)
  })
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      db.close()
      resolve()
    }
    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

export async function getRecordings(): Promise<Blob[]> {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readonly')
  const store = transaction.objectStore(STORE_NAME)
  
  return new Promise((resolve, reject) => {
    const request = store.getAllKeys()
    
    request.onsuccess = () => {
      const keys = request.result.sort() // Sort to maintain order
      const recordings: Blob[] = []
      let pending = keys.length
      
      if (pending === 0) {
        db.close()
        resolve([])
        return
      }
      
      keys.forEach(key => {
        const getRequest = store.get(key)
        getRequest.onsuccess = () => {
          recordings.push(getRequest.result)
          pending--
          if (pending === 0) {
            db.close()
            resolve(recordings)
          }
        }
        getRequest.onerror = () => {
          db.close()
          reject(getRequest.error)
        }
      })
    }
    
    request.onerror = () => {
      db.close()
      reject(request.error)
    }
  })
}

export async function clearRecordings(): Promise<void> {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  
  store.clear()
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      db.close()
      resolve()
    }
    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

