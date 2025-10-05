-- VoiceBank Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: voices
CREATE TABLE IF NOT EXISTS voices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voice_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recording_urls JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE
);

-- Table: saved_phrases
CREATE TABLE IF NOT EXISTS saved_phrases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_id UUID REFERENCES voices(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: shared_access (for family sharing - stretch goal)
CREATE TABLE IF NOT EXISTS shared_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_id UUID REFERENCES voices(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_voices_user_id ON voices(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_phrases_voice_id ON saved_phrases(voice_id);
CREATE INDEX IF NOT EXISTS idx_shared_access_token ON shared_access(share_token);

-- Enable Row Level Security (RLS)
ALTER TABLE voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voices table
CREATE POLICY "Users can view their own voices"
  ON voices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own voices"
  ON voices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voices"
  ON voices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voices"
  ON voices FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for saved_phrases table
CREATE POLICY "Users can view phrases for their voices"
  ON saved_phrases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = saved_phrases.voice_id
      AND voices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert phrases for their voices"
  ON saved_phrases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = saved_phrases.voice_id
      AND voices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own phrases"
  ON saved_phrases FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = saved_phrases.voice_id
      AND voices.user_id = auth.uid()
    )
  );

-- Storage bucket for recordings (run this in Supabase Storage dashboard)
-- Bucket name: recordings
-- Public: false
-- File size limit: 10MB
-- Allowed MIME types: audio/*

