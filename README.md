# 🎙️ VoiceBank - Preserve Your Voice Forever

**Simple. Free. 15 minutes.**

VoiceBank helps people facing voice loss (due to ALS, cancer, stroke, or progressive diseases) preserve their unique voice using advanced AI technology. What used to cost $3,000+ and take months is now free and takes just 15 minutes.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- An ElevenLabs API key (free tier available)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ElevenLabs API Key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

3. **Set up Supabase database:**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL script from `database.sql`
   - Create a storage bucket named `recordings` (optional, for backup storage)

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 Features

### ✅ Core Features (MVP)
- **Landing Page**: Compelling value proposition and call-to-action
- **Recording Session**: 8 guided prompts with real-time audio visualization
- **Voice Generation**: AI-powered voice cloning using ElevenLabs
- **Dashboard**: Type-to-speak interface with your preserved voice
- **Saved Phrases**: Save and quickly access commonly used phrases
- **Audio Download**: Export generated speech as MP3 files

### 🎁 Stretch Goals (Optional)
- Family sharing with secure tokens
- Original recordings gallery
- Multi-voice support
- Export to AAC device formats

---

## 📁 Project Structure

```
voicebank/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── record/page.tsx             # Recording session
│   ├── generate/page.tsx           # Voice generation loading
│   ├── dashboard/page.tsx          # Communication interface
│   └── api/
│       ├── generate-voice/route.ts # Voice cloning API
│       ├── speak/route.ts          # Text-to-speech API
│       ├── save-phrase/route.ts    # Save phrases API
│       └── record/route.ts         # Upload recordings API
├── components/
│   ├── RecordingPrompt.tsx         # Recording UI component
│   ├── WaveformVisualizer.tsx      # Audio visualization
│   └── VoicePlayer.tsx             # Playback controls
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── elevenlabs.ts               # ElevenLabs API wrapper
│   ├── audio-processor.ts          # Audio utilities
│   └── constants.ts                # Recording prompts & config
└── database.sql                    # Database schema
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Modern React framework |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Voice Recording** | Web Audio API | Browser-native audio capture |
| **Voice Cloning** | ElevenLabs API | AI voice synthesis |
| **Database** | Supabase (PostgreSQL) | User data & voice metadata |
| **Storage** | Supabase Storage | Audio file backup |
| **Hosting** | Vercel | Deployment platform |

---

## 🎬 User Journey

1. **Landing** → User sees value prop and clicks "Start Recording"
2. **Recording** → Complete 8 prompts (childhood memory, life advice, common phrases, etc.)
3. **Generation** → AI processes recordings and creates voice model (5-10 min)
4. **Dashboard** → Type any text and hear it in their preserved voice
5. **Daily Use** → Save favorite phrases, download audio, share with family

---

## 🔧 Configuration

### ElevenLabs Setup
1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Get your API key from the dashboard
3. Add it to `.env.local` as `ELEVENLABS_API_KEY`
4. Free tier includes enough credits for testing (~5 voices)

### Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Add them to `.env.local`
4. Run the `database.sql` script in the SQL Editor
5. (Optional) Create a `recordings` storage bucket for audio backup

---

## 📊 Database Schema

### `voices` table
Stores voice metadata and ElevenLabs voice IDs

### `saved_phrases` table
User's favorite phrases for quick access

### `shared_access` table (stretch goal)
Secure sharing tokens for family members

See `database.sql` for the complete schema with RLS policies.

---

## 🎯 Development Roadmap

- [x] Landing page with compelling value prop
- [x] Recording session with 8 prompts
- [x] Web Audio API integration
- [x] ElevenLabs voice cloning
- [x] Text-to-speech dashboard
- [x] Save phrases functionality
- [x] Audio download
- [ ] User authentication
- [ ] Family sharing with QR codes
- [ ] Recordings gallery
- [ ] Mobile app (React Native)

---

## 🚨 Important Notes

### Privacy & Ethics
- Voice models are only accessible to the owner
- Clear consent is required during recording
- Generated audio includes metadata for identification
- For personal use only - not for impersonation

### API Costs
- **ElevenLabs Free Tier**: 10,000 characters/month (~5 voice clones)
- **Supabase Free Tier**: 500MB database, 1GB storage
- Budget $20-30 for extended hackathon testing if needed

### Browser Compatibility
- Requires modern browser with Web Audio API support
- Best experience on Chrome, Firefox, Safari, Edge
- Microphone permission required

---

## 🤝 Contributing

This is a hackathon project built for social good. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

MIT License - Feel free to use this code to help people preserve their voices.

---

## 💙 Impact

**30,000+ Americans lose their voice each year.** VoiceBank makes voice preservation accessible to everyone, preserving not just communication ability but identity, legacy, and connection with loved ones.

> "This is my voice. My family will always hear *me*."

---

## 🔗 Resources

- [ElevenLabs API Documentation](https://elevenlabs.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [ALS Association](https://www.als.org/)

---

**Built with ❤️ for those who need it most.**

Preserve your voice. Forever. 🎙️

