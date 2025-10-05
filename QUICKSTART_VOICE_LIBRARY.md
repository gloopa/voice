# 🚀 Voice Library - Quick Start Guide

## For Users

### First Time Recording a Voice
1. Go to homepage
2. Click **"Start Recording"**
3. Record all 8 prompts
4. Enter a name (e.g., "My Voice")
5. Wait 5-8 minutes for generation
6. Your voice is saved forever! ✅

### Using Your Saved Voice Later
1. Go to homepage
2. Click **"My Voices"**
3. Click **"Use Voice"** on any saved voice
4. Type text and hear your voice! 🎙️

### Managing Your Voices
- **Rename**: Voice Library → Click "Rename"
- **Delete**: Voice Library → Click "Delete"
- **Switch**: Dashboard → Use dropdown selector

---

## For Developers

### Setup Required
```bash
# 1. Ensure database is set up
# Run database.sql in Supabase SQL Editor

# 2. Environment variables set
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
ELEVENLABS_API_KEY=your-key

# 3. Start the app
npm run dev
```

### Key Files
- **API**: `/app/api/voices/route.ts`
- **Component**: `/components/VoiceSelector.tsx`
- **Page**: `/app/voices/page.tsx`
- **Docs**: `/VOICE_LIBRARY_GUIDE.md`

### Quick Test
```javascript
// Get all voices
fetch('/api/voices')
  .then(r => r.json())
  .then(data => console.log(data.voices))

// Create voice (happens automatically after recording)
// Check in Voice Library page

// Rename voice
fetch('/api/voices', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 'uuid', name: 'New Name' })
})
```

---

## Features at a Glance

| Feature | Location | Status |
|---------|----------|--------|
| Record Voice | `/record` | ✅ Working |
| Name Voice | After recording | ✅ Working |
| Save to DB | Automatic | ✅ Working |
| View Library | `/voices` | ✅ Working |
| Select Voice | Dashboard dropdown | ✅ Working |
| Rename Voice | Voice Library | ✅ Working |
| Delete Voice | Voice Library | ✅ Working |
| Use Voice | Dashboard TTS | ✅ Working |

---

## Common Tasks

### Add Authentication (Next Step)
```typescript
// In /app/api/generate-voice/route.ts
const { data: { user } } = await supabase.auth.getUser()
// Pass user.id instead of null
```

### Upload Original Recordings
```typescript
// In /app/api/generate-voice/route.ts
// Upload recordings to Supabase Storage
const urls = await Promise.all(
  audioFiles.map(file => 
    supabase.storage
      .from('recordings')
      .upload(`${voiceId}/${file.name}`, file)
  )
)
```

### Add Voice Preview
```typescript
// Pre-generate sample phrase
const sampleAudio = await generateSpeech(
  "Hello, this is a sample of my voice.",
  voiceId
)
// Store URL in database
```

---

## Troubleshooting

### Voice not appearing in library
```sql
-- Check database
SELECT * FROM voices WHERE is_active = true;
```

### Can't connect to Supabase
```bash
# Check env variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Voice selector not showing
```javascript
// Check browser console for errors
// Verify voices array in React DevTools
```

---

## Architecture Summary

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ├─→ Record Voice → IndexedDB (temp)
       │
       ├─→ Generate → ElevenLabs API
       │
       ├─→ Save → Supabase Database ✅
       │
       └─→ Use → Text-to-Speech
```

---

## Next Steps

1. ✅ **Done**: Voice storage and management
2. 🔜 **Next**: Add user authentication
3. 🔜 **Then**: Upload original recordings
4. 🔜 **Future**: Voice sharing and analytics

---

**Need more details?** Read `VOICE_LIBRARY_GUIDE.md`

**Ready to deploy?** Check `IMPLEMENTATION_SUMMARY.md`

---

🎙️ **Your voices are now preserved forever!** 🎉

