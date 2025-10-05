# 🎙️ Voice Library - Long-term Voice Preservation Guide

## Overview

Your VoiceBank application now supports **long-term voice preservation**! Users can record multiple voices, save them permanently to the database, and access them anytime - even after they lose their voice.

## 🌟 Key Features

### 1. **Multiple Voice Storage**
- Users can record and save unlimited voices
- Each voice is permanently stored in Supabase database
- Voices are linked to ElevenLabs for text-to-speech generation

### 2. **Voice Management**
- View all saved voices in the Voice Library (`/voices`)
- Rename voices (e.g., "Mom's Voice", "Dad's Voice", "My Voice")
- Delete voices when no longer needed
- See creation dates for each voice

### 3. **Easy Voice Selection**
- Quick voice selector in dashboard
- Switch between voices instantly
- Auto-loads most recent voice by default

### 4. **Persistent Storage**
- Voices are stored in Supabase PostgreSQL database
- Survive browser refreshes and device changes
- Accessible from any device (when auth is added)

---

## 🏗️ Architecture

### Database Schema

```sql
CREATE TABLE voices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  voice_id TEXT NOT NULL,              -- ElevenLabs voice ID
  name TEXT NOT NULL,                   -- User-friendly name
  created_at TIMESTAMP DEFAULT NOW(),
  recording_urls JSONB DEFAULT '[]',   -- Original audio files (future)
  is_active BOOLEAN DEFAULT TRUE
);
```

### Data Flow

```
1. User Records Voice → IndexedDB (temporary)
2. User Names Voice → sessionStorage
3. Voice Generated → ElevenLabs API
4. Voice Saved → Supabase Database
5. Voice Available → Forever!
```

---

## 📁 New Files Created

### API Routes

1. **`/app/api/voices/route.ts`**
   - `GET` - Fetch all active voices (optionally filtered by user)
   - `PATCH` - Update voice name or active status
   - `DELETE` - Soft delete a voice

### Components

2. **`/components/VoiceSelector.tsx`**
   - Dropdown component for selecting voices
   - Shows voice name and creation date
   - Beautiful UI with icons

### Pages

3. **`/app/voices/page.tsx`**
   - Voice Library management page
   - List all saved voices
   - Rename, delete, or use voices
   - Link to record new voice

---

## 🔄 Updated Files

### 1. **`/app/api/generate-voice/route.ts`**
**Changes:**
- Now accepts `voiceName` and `userId` parameters
- Saves voice metadata to Supabase after ElevenLabs creation
- Returns both `voiceId` (ElevenLabs) and `dbId` (Supabase)

**Before:**
```typescript
body: JSON.stringify({ recordings })
```

**After:**
```typescript
body: JSON.stringify({ 
  recordings,
  voiceName: "My Voice",
  userId: null 
})
```

### 2. **`/app/dashboard/page.tsx`**
**Changes:**
- Loads all user voices on mount
- Integrates VoiceSelector component
- Auto-selects most recent voice
- Adds "Voice Library" button in header

**New Features:**
- Voice dropdown selector
- Persistent voice selection
- Link to voice library

### 3. **`/app/record/page.tsx`**
**Changes:**
- Shows name dialog after completing all recordings
- Allows user to name their voice
- Stores voice name in sessionStorage
- Better UX for voice creation

**New Features:**
- Voice naming modal
- Default name generation
- Enter key support

### 4. **`/app/generate/page.tsx`**
**Changes:**
- Reads voice name from sessionStorage
- Sends voice name to API
- Stores database ID for future reference

### 5. **`/app/page.tsx`**
**Changes:**
- Added "My Voices" button to homepage
- Links to Voice Library
- Better navigation flow

---

## 🎯 User Journey

### First-Time User
1. Lands on homepage
2. Clicks "Start Recording"
3. Records 8 prompts
4. Names their voice → **"My Voice"**
5. Voice is generated and saved to database
6. Redirected to dashboard with voice ready

### Returning User (Critical Use Case!)
1. Lands on homepage
2. Clicks **"My Voices"** → Goes to Voice Library
3. Sees all their saved voices
4. Clicks **"Use Voice"** on desired voice
5. Redirected to dashboard
6. Types text and hears their preserved voice ❤️

### User with Multiple Voices
1. Has saved "My Voice" and "Dad's Voice"
2. In dashboard, uses dropdown to switch between voices
3. Can manage all voices in Voice Library
4. Can record new voices anytime

---

## 💡 Use Cases

### 1. **Personal Voice Banking**
- User diagnosed with ALS
- Records voice while still able
- Saves as "My Voice"
- Can use it after losing speech ability

### 2. **Family Voice Preservation**
- Record elderly parents' voices
- Save as "Mom's Voice" and "Dad's Voice"
- Preserve for future generations
- Access anytime to hear their voice

### 3. **Multiple Voice Clones**
- Professional voice actor
- Records different character voices
- Names: "Hero Voice", "Villain Voice", "Narrator Voice"
- Switch between them for different projects

### 4. **Emergency Backup**
- Person at risk of losing voice
- Records voice preventatively
- Stored safely in cloud
- Peace of mind knowing voice is preserved

---

## 🔐 Security & Privacy

### Current Implementation
- **No authentication yet** - All voices are public
- Voices stored with optional `user_id` field
- Ready for authentication integration

### Future Authentication (Recommended)
1. Add Supabase Auth
2. Filter voices by `user_id`
3. Implement Row Level Security (RLS)
4. Only show user's own voices

### RLS Policies (Already in database.sql)
```sql
CREATE POLICY "Users can view their own voices"
  ON voices FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🚀 API Usage

### Get All Voices
```javascript
const response = await fetch('/api/voices')
const data = await response.json()
// Returns: { voices: Voice[] }
```

### Get User's Voices (When Auth Added)
```javascript
const response = await fetch(`/api/voices?userId=${userId}`)
const data = await response.json()
```

### Rename a Voice
```javascript
await fetch('/api/voices', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    id: 'voice-uuid',
    name: 'New Name'
  })
})
```

### Delete a Voice
```javascript
await fetch(`/api/voices?id=${voiceId}`, {
  method: 'DELETE'
})
```

---

## 🎨 UI Components

### VoiceSelector
```tsx
<VoiceSelector
  voices={voices}
  selectedVoice={selectedVoice}
  onSelectVoice={(voice) => setSelectedVoice(voice)}
/>
```

**Features:**
- Dropdown with all voices
- Shows voice name and creation date
- Checkmark for selected voice
- Empty state when no voices

---

## 📊 Database Queries

### Get All Active Voices
```sql
SELECT * FROM voices 
WHERE is_active = true 
ORDER BY created_at DESC;
```

### Get User's Voices
```sql
SELECT * FROM voices 
WHERE user_id = '...' 
AND is_active = true 
ORDER BY created_at DESC;
```

### Soft Delete
```sql
UPDATE voices 
SET is_active = false 
WHERE id = '...';
```

---

## 🔮 Future Enhancements

### Phase 1 (Current) ✅
- [x] Voice storage in database
- [x] Voice management UI
- [x] Voice selector in dashboard
- [x] Voice naming

### Phase 2 (Next)
- [ ] User authentication (Supabase Auth)
- [ ] Voice sharing (family access)
- [ ] Voice samples preview
- [ ] Voice quality ratings

### Phase 3 (Advanced)
- [ ] Upload original recordings to Supabase Storage
- [ ] Voice analytics (usage stats)
- [ ] Voice export/download
- [ ] Voice transfer between accounts
- [ ] Voice backup to external storage

### Phase 4 (Premium)
- [ ] Voice version control
- [ ] Voice fine-tuning interface
- [ ] Collaborative voice management
- [ ] Voice marketplace (optional)

---

## 🐛 Troubleshooting

### Voice Not Appearing
1. Check browser console for errors
2. Verify Supabase connection
3. Check database.sql was run
4. Ensure `voices` table exists

### Can't Switch Voices
1. Clear sessionStorage
2. Refresh page
3. Check VoiceSelector is rendering
4. Verify voices array has data

### Voice Deleted by Accident
- Soft delete only sets `is_active = false`
- Can be recovered from database:
```sql
UPDATE voices SET is_active = true WHERE id = '...';
```

---

## 📝 Testing Checklist

### Basic Flow
- [ ] Record a new voice
- [ ] Name the voice
- [ ] Voice appears in dashboard
- [ ] Voice appears in Voice Library
- [ ] Can switch between voices
- [ ] Can rename voice
- [ ] Can delete voice

### Edge Cases
- [ ] No voices recorded yet
- [ ] Only one voice
- [ ] Multiple voices with same name
- [ ] Very long voice names
- [ ] Special characters in names

---

## 💪 Best Practices

### For Users
1. **Name voices descriptively** - "My Voice 2024" better than "Voice 1"
2. **Record multiple versions** - Voice quality improves over time
3. **Test before deleting** - Make sure you have a backup
4. **Regular backups** - Export important voices

### For Developers
1. **Always use soft delete** - Never hard delete voices
2. **Validate voice names** - Prevent SQL injection
3. **Add error handling** - Show friendly error messages
4. **Log important actions** - Track voice creation/deletion
5. **Rate limit API** - Prevent abuse

---

## 🎉 Success Metrics

### User Engagement
- Number of voices created per user
- Voice library visits
- Voice switches per session
- Voice renames (indicates customization)

### Technical Health
- API response times
- Database query performance
- Error rates
- Voice generation success rate

---

## 📚 Related Documentation

- [SETUP.md](./SETUP.md) - Initial setup instructions
- [DATABASE.sql](./database.sql) - Database schema
- [STORAGE_FIX.md](./STORAGE_FIX.md) - IndexedDB implementation
- [MAXIMUM_QUALITY_GUIDE.md](./MAXIMUM_QUALITY_GUIDE.md) - Voice quality tips

---

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase configuration
3. Check API responses in Network tab
4. Review database logs
5. Ensure ElevenLabs API key is valid

---

**🎙️ Your voice is now preserved forever! 🎉**

