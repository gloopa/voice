# 🚀 VoiceBank Setup Guide

Follow these steps to get VoiceBank running on your machine.

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Supabase, ElevenLabs, and more.

## Step 2: Get Your API Keys

### ElevenLabs API Key

1. Go to [https://elevenlabs.io](https://elevenlabs.io)
2. Sign up for a free account
3. Navigate to your Profile Settings
4. Copy your API key
5. **Free tier includes**: 10,000 characters/month (~5 voice clones)

### Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project (free tier is perfect)
3. Wait for the project to be provisioned (~2 minutes)
4. Go to Project Settings → API
5. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory (copy from `.env.local.example`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here

# ElevenLabs API Key
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
```

⚠️ **Important**: Never commit `.env.local` to git!

## Step 4: Set Up the Database

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `database.sql` and paste it
5. Click **Run** or press `Ctrl+Enter`
6. You should see: "Success. No rows returned"

### (Optional) Set Up Storage

If you want to backup recordings to Supabase:

1. Go to **Storage** in the Supabase dashboard
2. Click **Create a new bucket**
3. Name it: `recordings`
4. Set to **Private**
5. Click **Create bucket**

## Step 5: Run the Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Application

1. **Landing Page**: Visit `http://localhost:3000`
2. **Start Recording**: Click "Start Recording" button
3. **Complete Prompts**: Record at least 2-3 prompts (you can skip some for testing)
4. **Voice Generation**: Wait for the voice model to be created
5. **Dashboard**: Type a message and click "Speak"

## 🎯 Quick Test Flow (5 minutes)

For rapid testing without doing all 8 prompts:

1. Modify `RECORDING_PROMPTS` in `lib/constants.ts` to only include 2-3 prompts
2. Record those prompts
3. Generate voice (may have lower quality with fewer samples)
4. Test text-to-speech in dashboard

## 🐛 Troubleshooting

### "Microphone access denied"
- Check browser permissions (usually top-right corner)
- Make sure you're using HTTPS (or localhost)
- Try a different browser (Chrome works best)

### "Failed to generate voice"
- Verify your ElevenLabs API key is correct
- Check you have remaining credits (free tier: 10,000 chars/month)
- Look at browser console (F12) for detailed error messages

### "Supabase connection error"
- Double-check your Supabase URL and key in `.env.local`
- Make sure you ran the `database.sql` script
- Verify your Supabase project is active (not paused)

### "Audio not playing"
- Check your browser's audio settings
- Make sure volume is up
- Try a different browser

### Voice quality is poor
- Record in a quiet environment
- Speak clearly and naturally
- Record all 8 prompts (more data = better quality)
- Try different microphone positions

## 📝 Development Tips

### Bypass Voice Generation (for UI testing)
To test the dashboard without waiting for voice generation:

1. Open browser console
2. Run: `sessionStorage.setItem('voiceId', 'test-voice-id')`
3. Navigate to `/dashboard`
4. Note: Text-to-speech won't work without a real voice ID

### Use Mock Data
For testing without API calls, you can temporarily modify the API routes to return mock data.

### Reset Everything
To start fresh:

```bash
# Clear browser storage
localStorage.clear()
sessionStorage.clear()

# Or just open in Incognito/Private mode
```

## 🚀 Building for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start
```

## 🌐 Deploying to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

Vercel will automatically:
- Install dependencies
- Build the Next.js app
- Deploy to a global CDN
- Provide a production URL

## 🎉 You're Ready!

Your VoiceBank application is now set up and running. Start preserving voices!

Need help? Check:
- `README.md` - Full documentation
- `CONTEXT.MD` - Original project spec
- GitHub Issues - Report bugs or ask questions

---

**Happy voice banking! 🎙️💙**

