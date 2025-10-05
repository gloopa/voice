# ⚡ VoiceBank - 5-Minute Quickstart

Get VoiceBank running in 5 minutes or less!

## Step 1: Get API Keys (2 minutes)

### ElevenLabs
1. Go to https://elevenlabs.io
2. Click "Sign Up" (or Sign In)
3. Click your profile picture → "Profile"
4. Copy your API key
5. Paste it in `.env.local` (see Step 2)

### Supabase
1. Go to https://supabase.com
2. Click "Start your project" → Sign up
3. Click "New project"
   - Name: voicebank-demo
   - Database Password: (generate one)
   - Region: (closest to you)
4. Wait ~2 minutes for provisioning
5. Go to Settings → API
6. Copy:
   - Project URL
   - anon/public key
7. Paste in `.env.local`

## Step 2: Configure Environment (1 minute)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ELEVENLABS_API_KEY=sk_...
```

## Step 3: Set Up Database (1 minute)

1. Go to your Supabase project
2. Click "SQL Editor" in left sidebar
3. Click "New Query"
4. Copy ALL contents from `database.sql`
5. Paste and click "Run" (Ctrl/Cmd + Enter)
6. Should see: "Success. No rows returned"

## Step 4: Run the App! (1 minute)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 🎉 Done!

You should see the VoiceBank landing page.

Click "Start Recording" to begin!

---

## 🚨 Troubleshooting

### "Cannot find module..."
```bash
npm install
```

### "Supabase connection error"
- Double-check your `.env.local` values
- Make sure you ran `database.sql`
- Verify your Supabase project is active

### "ElevenLabs API error"
- Verify your API key is correct
- Check you have free credits remaining
- Try creating a new API key

### "Microphone not working"
- Check browser permissions (top-right corner)
- Make sure you're on localhost (or HTTPS)
- Try refreshing the page

---

## 🎬 Quick Demo (No API Setup)

Want to see the UI without API setup?

1. Run `npm run dev`
2. Browse the pages:
   - `/` - Landing page
   - `/record` - Recording interface (won't save)
   - `/dashboard` - Dashboard (won't generate audio)

To test the full flow, you'll need both API keys.

---

## 💰 Free Tier Limits

- **ElevenLabs**: 10,000 characters/month (~5 voice clones)
- **Supabase**: 500MB database, 1GB storage (plenty!)

Both are **completely free** for hackathon use!

---

## ⏱️ Time Estimates

- Landing page → Record: **Instant**
- Recording 8 prompts: **10-15 minutes**
- Voice generation: **5-10 minutes**
- Text-to-speech: **2-3 seconds per phrase**

---

**That's it! You're ready to preserve voices. 🎙️**

