# 🎙️ VoiceBank — MVP Context & Build Guide

## 🎯 Mission
**Preserve your voice before you lose it.**

Help the 30,000+ people per year who lose their voice to ALS, laryngeal cancer, stroke, or progressive diseases by making voice banking **free, fast, and accessible**.

---

## 🏆 Why This Wins the Hackathon

### Emotional Impact
- **Guaranteed to make judges cry** — Voice preservation hits universally
- Strong human story: "This is my voice. My family will always hear *me*."
- Shows AI solving a desperate medical need, not a "nice-to-have"

### Technical Innovation
- Professional voice banking costs **$3,000+ and takes months**
- We make it **free and 15 minutes** using modern voice cloning AI
- Novel application of TTS technology for genuine social good

### Feasibility
- ✅ No hardware required
- ✅ Works with existing APIs (ElevenLabs/PlayHT)
- ✅ Simple, focused scope
- ✅ Can demo in 90 seconds with massive impact

### Market Gap
- **Blue ocean**: No free, accessible voice banking exists
- Addresses real medical need with 30k+ annual TAM in US alone
- Competes with expensive medical solutions, not other hackathon apps

---

## 👤 User Journey (End-to-End)

### **ACT 1: Landing (60 seconds)**
User arrives → sees value prop → clicks "Start Recording"

```
Landing Page:
- Headline: "Preserve Your Voice Forever"
- Subhead: "Simple. Free. 15 minutes."
- CTA: [Start Recording →]
- Hook: "30,000 people lose their voice each year. Don't wait."
```

**What happens:**
- Request microphone permission
- Show 30-second explainer video
- Set emotional context

---

### **ACT 2: Recording Session (10-15 minutes)**

**8 Guided Prompts** designed to capture natural voice + emotion:

1. **Warm-Up** (1 min)
   - "Say: Hello, this is my voice"
   - Test audio quality, give feedback

2. **Childhood Memory** (1-2 min)
   - "Tell us about your favorite childhood memory"
   - Captures natural storytelling tone

3. **Someone You Love** (1-2 min)
   - "Describe someone you love and why they're special"
   - Rich emotional inflection

4. **Life Advice** (1-2 min)
   - "What advice would you give your younger self?"
   - Conversational, reflective tone

5. **Reading Passage** (1 min)
   - "Read this passage:" [The Rainbow Passage - phonetically diverse]
   - Covers all phonetic sounds

6. **Proudest Moment** (1-2 min)
   - "Tell us about your proudest accomplishment"
   - Positive, energetic tone

7. **Legacy Statement** (1-2 min)
   - "What do you want people to remember about you?"
   - Deep, meaningful content

8. **Common Phrases** (1-2 min)
   - "Say these phrases:" 
   - I love you / I'm proud of you / Thank you / Good morning / See you soon
   - Practical daily use

**UI for Each Prompt:**
```
┌─────────────────────────────────────┐
│  Step 2 of 8: A Favorite Memory     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  Tell us about your favorite        │
│  childhood memory.                  │
│                                     │
│  Take your time. Speak naturally.   │
│                                     │
│     🔴 Recording... (1:34)          │
│     ▓▓▓▓▓▓▓▓▓░░░░░ (waveform)      │
│                                     │
│  [Done] [Re-record]                 │
└─────────────────────────────────────┘
```

**Recording Tech:**
- Use Web Audio API (`navigator.mediaDevices.getUserMedia`)
- Show real-time waveform visualization
- Save as WAV/MP3 files
- Upload to Supabase Storage as backup

---

### **ACT 3: Voice Generation (5-10 minutes)**

**User sees:**
```
┌─────────────────────────────────────┐
│      🔮 Creating Your Voice...      │
│      ████████████░░░░░░░░ 65%      │
│                                     │
│  Our AI is learning:                │
│  ✓ Tone and pitch patterns          │
│  ✓ Speech rhythm                    │
│  ⏳ Emotional inflections           │
│  ⏳ Pronunciation style              │
│                                     │
│  Takes 5-8 minutes. Grab coffee ☕  │
└─────────────────────────────────────┘
```

**What happens behind the scenes:**
```javascript
// 1. Preprocess audio
const cleanedAudio = await preprocessAudio(recordings);

// 2. Upload to voice cloning API
const voiceId = await elevenLabs.voices.add({
  name: `${userName}'s Voice`,
  files: cleanedAudio,
  description: "Personal voice preservation"
});

// 3. Save to database
await supabase.from('voices').insert({
  user_id: user.id,
  voice_id: voiceId,
  recording_urls: originalAudioUrls,
  created_at: new Date()
});

// 4. Return success
return { voiceId, status: 'ready' };
```

---

### **ACT 4: The Reveal ("Wow" Moment)**

```
┌─────────────────────────────────────┐
│      ✨ Your Voice is Ready!        │
│                                     │
│  Let's hear it. Type anything:      │
│  ┌─────────────────────────────┐   │
│  │ Hello world, this is me!    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────┐       │
│  │   🔊 Speak         │       │
│  └─────────────────────────┘       │
│                                     │
│  Or try:                            │
│  💬 "I love you"                    │
│  💬 "I'm so proud of you"           │
└─────────────────────────────────────┘
```

**User hears their cloned voice speaking.**

**Technical flow:**
```javascript
async function speak(text) {
  const audio = await elevenLabs.textToSpeech({
    text: text,
    voice_id: user.voiceId,
    model_id: "eleven_turbo_v2"
  });
  
  playAudio(audio);
}
```

---

### **ACT 5: Communication Interface (Daily Use)**

```
┌─────────────────────────────────────┐
│  🎙️ VoiceBank — Sarah's Voice      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  What do you want to say?   │   │
│  │  [Type here...]             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌────────────┐  ┌──────────────┐  │
│  │ 🔊 Speak   │  │ 💾 Save      │  │
│  └────────────┘  └──────────────┘  │
│                                     │
│  📌 Saved Phrases:                  │
│  • "Good morning, I love you"       │
│  • "I'm proud of you"               │
│  • "Thank you for everything"       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Share with Family          │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Features:**
- **Type-to-speak**: Real-time TTS in user's voice
- **Save favorites**: Common phrases for quick access
- **Download audio**: Export as MP3 for AAC devices
- **Family sharing**: QR code/link for loved ones

---

### **ACT 6: Family Sharing (Stretch Goal)**

Generate shareable link → Family gets read-only access

```
Family Interface:
┌─────────────────────────────────────┐
│  Sarah's Voice 💙                   │
│                                     │
│  Type a message:                    │
│  ┌─────────────────────────────┐   │
│  │  I miss you, mom            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────┐       │
│  │   🔊 Speak         │       │
│  └─────────────────────────┘       │
│                                     │
│  Sarah's favorites:                 │
│  💬 "I love you so much"            │
│  💬 "You make me proud"             │
└─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) | Fast, modern, great DX |
| **UI Components** | Tailwind CSS + shadcn/ui | Beautiful, accessible components |
| **Voice Recording** | Web Audio API | Browser native, no dependencies |
| **Voice Cloning** | ElevenLabs API (primary) or PlayHT (backup) | Best quality, $5-11 free credits |
| **Database** | Supabase (PostgreSQL) | Free tier, built-in auth + storage |
| **File Storage** | Supabase Storage | S3-compatible, free 1GB |
| **Auth** | Supabase Auth (optional) | Email/OAuth, quick setup |
| **Hosting** | Vercel | Free, optimized for Next.js |

---

## 📊 Database Schema

### **Table: `voices`**
```sql
CREATE TABLE voices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  voice_id TEXT NOT NULL,              -- ElevenLabs voice ID
  name TEXT NOT NULL,                   -- "Sarah's Voice"
  created_at TIMESTAMP DEFAULT NOW(),
  recording_urls JSONB,                 -- Original audio files
  is_active BOOLEAN DEFAULT TRUE
);
```

### **Table: `saved_phrases`**
```sql
CREATE TABLE saved_phrases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_id UUID REFERENCES voices(id),
  text TEXT NOT NULL,
  category TEXT,                        -- "daily", "special", etc.
  audio_url TEXT,                       -- Pre-generated MP3
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Table: `shared_access` (Stretch)**
```sql
CREATE TABLE shared_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_id UUID REFERENCES voices(id),
  share_token TEXT UNIQUE NOT NULL,     -- Random secure token
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  access_count INTEGER DEFAULT 0
);
```

---

## 📁 Project Structure

```
voicebank/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── record/
│   │   └── page.tsx                # Recording session
│   ├── generate/
│   │   └── page.tsx                # Voice generation loading
│   ├── dashboard/
│   │   └── page.tsx                # Main communication interface
│   ├── share/
│   │   └── [token]/
│   │       └── page.tsx            # Family sharing view
│   └── api/
│       ├── record/route.ts         # Upload recordings
│       ├── generate-voice/route.ts # Trigger voice cloning
│       ├── speak/route.ts          # TTS endpoint
│       └── save-phrase/route.ts    # Save favorite phrases
│
├── components/
│   ├── RecordingPrompt.tsx         # Individual prompt UI
│   ├── WaveformVisualizer.tsx      # Audio waveform
│   ├── VoicePlayer.tsx             # Audio playback controls
│   └── ShareModal.tsx              # QR code generation
│
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── elevenlabs.ts               # Voice cloning API
│   ├── audio-processor.ts          # Audio manipulation utils
│   └── constants.ts                # Prompts, config
│
└── public/
    ├── rainbow-passage.txt         # Reading passage
    └── explainer-video.mp4         # Onboarding video
```

---

## ⏱️ Development Timeline (36 Hours)

### **Hours 0-6: Recording Interface** ✅
**Goal:** Beautiful, functional recording flow

- [ ] Set up Next.js project + Supabase
- [ ] Build landing page with value prop
- [ ] Implement microphone permission flow
- [ ] Create `RecordingPrompt` component
- [ ] Add waveform visualization
- [ ] Store recordings in Supabase Storage
- [ ] Progress bar (1/8, 2/8, etc.)

**Checkpoint:** Can record 8 prompts and see playback

---

### **Hours 6-12: Voice Cloning Integration** ✅
**Goal:** Generate working voice model

- [ ] Set up ElevenLabs API keys
- [ ] Build `/api/generate-voice` endpoint
- [ ] Upload audio files to ElevenLabs
- [ ] Handle async voice creation (polling or webhook)
- [ ] Store `voice_id` in database
- [ ] Create loading screen with progress updates
- [ ] Error handling + retry logic

**Checkpoint:** Voice model successfully created

---

### **Hours 12-20: Communication Interface** ✅
**Goal:** Users can type and hear their voice

- [ ] Build dashboard page
- [ ] Text input with "Speak" button
- [ ] `/api/speak` endpoint (TTS with voice_id)
- [ ] Audio player component
- [ ] "Save phrase" functionality
- [ ] Display saved phrases list
- [ ] Download audio as MP3

**Checkpoint:** Full type → speak → save flow works

---

### **Hours 20-28: Polish + Real Demos** ✅
**Goal:** Demo-ready with emotional impact

- [ ] Improve UI/UX (bigger fonts, clearer CTAs)
- [ ] Add loading states everywhere
- [ ] Record 2-3 team member voices
- [ ] Test with different voice types
- [ ] Add example phrases ("Try: 'I love you'")
- [ ] Create demo video (90 seconds)
- [ ] Write compelling pitch script

**Checkpoint:** Can deliver flawless demo

---

### **Hours 28-36: Stretch Goals + Pitch** 🎯
**Goal:** Maximum impact

**If ahead of schedule:**
- [ ] Family sharing with QR codes
- [ ] Original recordings gallery ("Memories")
- [ ] Export to AAC device formats
- [ ] Multi-voice support (child vs adult voice)

**Must do:**
- [ ] Devpost submission (screenshots, video, story)
- [ ] Practice 3-minute pitch
- [ ] Backup demo (offline mode)
- [ ] Team photo + branding

**Checkpoint:** Ready to win

---

## 🎬 Demo Script (90 Seconds)

### **Opening Hook (10 sec)**
*"What would you say to your family if you knew you were losing your voice forever?"*

[Pause for impact]

---

### **The Problem (15 sec)**
*"30,000 Americans this year will lose their ability to speak due to ALS, cancer, or stroke."*

*"Current voice banking solutions cost $3,000 and take months. Most people miss the window entirely."*

---

### **The Solution (30 sec)**
*"Meet VoiceBank. Watch this:"*

**[LIVE DEMO]**
1. *"This is Sarah. She spent 15 minutes recording her voice."* 
   - [Show recording interface, fast-forward through 2 prompts]

2. *"Our AI preserved her unique voice in just 10 minutes."*
   - [Show generation progress bar]

3. *"Now, even if Sarah can't speak..."*
   - [Type: "I love you, sweetheart"]
   - [Click "Speak"]

4. *"...her daughter still hears mom."*
   - [Play audio in Sarah's voice]

---

### **The Impact (20 sec)**
*[Switch to serious tone]*

*"This is my grandfather's voice. He recorded this before his stroke last year."*

[Play personal recording: "I'm proud of you, kiddo."]

*"Voice banking should be as common as writing a will. We're making that possible."*

---

### **The Ask (15 sec)**
*"VoiceBank is free, fast, and accessible to everyone."*

*"We preserve what makes us human — our voice, our identity, our connection."*

*"Thank you."*

[End with logo + tagline: **"Know before you go. → VoiceBank."**]

Wait, wrong tagline. Use:

**"Preserve your voice. Forever."**

---

## 💡 Key Talking Points for Judges

### **Technical Innovation**
- "We reduced voice banking from $3,000/months to free/15 minutes"
- "Using state-of-the-art voice cloning AI (ElevenLabs/PlayHT)"
- "Designed for accessibility: large text, simple UI, elderly-friendly"

### **Social Impact**
- "30,000+ people per year in US alone"
- "Preserves dignity and identity during trauma"
- "Helps families maintain connection with loved ones"

### **Scalability**
- "Works entirely in browser — no app install"
- "Supabase backend scales to millions"
- "Partnership opportunity with hospice/ALS organizations"

### **Market Validation**
- "Medical voice banking is a $50M+ industry"
- "Currently only available through speech pathologists"
- "We democratize access completely"

---

## 🚨 Risks & Mitigation

### **Risk 1: Voice quality isn't good enough**
**Mitigation:**
- Set expectations: "90% as good as $3k solution"
- Show side-by-side comparison in demo
- Emphasize "better than robot voice" angle
- Have backup demos pre-recorded

### **Risk 2: API costs**
**Mitigation:**
- ElevenLabs: $5 free credit (~5 voices)
- PlayHT: Similar free tier
- Budget $20-30 for hackathon if needed
- Cache generated audio to avoid re-generation

### **Risk 3: Recording quality varies**
**Mitigation:**
- Real-time audio level monitoring
- Guide users: "Speak a bit louder"
- Noise reduction in preprocessing
- Allow re-recording any prompt

### **Risk 4: Ethical concerns (deepfakes)**
**Mitigation:**
- Clear consent during recording
- Voice only accessible to owner + shared family
- Add disclaimer: "For personal use only"
- Watermark generated audio (optional)

### **Risk 5: Technical failures during demo**
**Mitigation:**
- Pre-record backup demo video
- Have offline mode with cached voices
- Test on multiple devices beforehand
- Bring backup laptop

---

## 📈 Success Metrics

### **For Hackathon:**
- ✅ Flawless 90-second demo
- ✅ Judges visibly emotional
- ✅ Clear differentiation from competitors
- ✅ Working prototype, not just slides

### **Post-Hackathon (if pursuing):**
- Partner with 1-2 ALS/cancer organizations
- 100 beta users within 3 months
- Testimonial video from real patient
- Explore grants (NIH, ALS Association, etc.)

---

## 🎯 Winning Strategy

1. **Lead with emotion** — Every judge knows someone who's lost their voice
2. **Show, don't tell** — Live demo is everything
3. **Emphasize accessibility** — "Free, fast, for everyone"
4. **Personal story** — Use team member's real recording
5. **Clear call-to-action** — "Help us preserve voices for those who need it most"

---

## 🔗 Resources

### **APIs & Services**
- ElevenLabs: https://elevenlabs.io/docs/api-reference
- PlayHT (backup): https://play.ht/docs/
- Supabase: https://supabase.com/docs
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

### **Inspiration & Research**
- "The Rainbow Passage": https://www.dialectsarchive.com/the-rainbow-passage
- ALS Association: https://www.als.org/
- Model Talker (expensive alternative): https://www.modeltalker.org/

### **Design Assets**
- Voice/microphone icons: https://lucide.dev/
- Waveform library: https://wavesurfer-js.org/
- Color palette: Warm, accessible blues and greens

---

## 💬 Tagline & Branding

**Primary Tagline:**
> "Preserve your voice. Forever."

**Secondary Options:**
> "Your voice. Your legacy. Your family."
> "Don't wait until it's too late."
> "Because your voice matters."

**Logo Concept:**
Simple microphone icon with sound wave, warm blue color (#4A90E2)

---

## ✅ Pre-Demo Checklist

**48 Hours Before:**
- [ ] All core features working
- [ ] Tested on 3+ devices
- [ ] Demo script memorized
- [ ] Backup video recorded
- [ ] Devpost draft ready

**24 Hours Before:**
- [ ] Fresh recordings from team
- [ ] Pitch deck printed (if needed)
- [ ] All API keys tested
- [ ] Contingency plans documented

**2 Hours Before:**
- [ ] Full run-through (3x)
- [ ] Devices charged
- [ ] Internet backup (hotspot)
- [ ] Team roles assigned

---

## 🏆 Why VoiceBank Wins

✅ **Emotional resonance** — Universal human need  
✅ **Technical excellence** — Sophisticated AI use  
✅ **Social impact** — Solves desperate medical problem  
✅ **Execution** — Beautiful, working prototype  
✅ **Storytelling** — Clear narrative arc  
✅ **Feasibility** — Can actually build this in 36 hours  

**Expected Result:** Top 3 finish, likely winner

---

**Now go build something that makes people cry (in a good way). You got this. 🎙️💙**