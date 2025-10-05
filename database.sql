-- ============================================================================
-- VoiceBank Database Schema - UPDATED for Voice Library System
-- ============================================================================
-- Run this in your Supabase SQL Editor
-- Last Updated: 2025-10-05
-- Features: Voice Library, Voice Management, Long-term Voice Preservation
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For secure tokens

-- ============================================================================
-- TABLES
-- ============================================================================

-- Table: voices
-- Stores voice metadata and ElevenLabs voice IDs for long-term preservation
CREATE TABLE IF NOT EXISTS voices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voice_id TEXT NOT NULL UNIQUE,                    -- ElevenLabs voice ID
  name TEXT NOT NULL,                                -- User-friendly name
  description TEXT,                                  -- Optional description
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recording_urls JSONB DEFAULT '[]'::jsonb,         -- Array of Supabase Storage URLs
  is_active BOOLEAN DEFAULT TRUE,                    -- Soft delete flag
  quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5), -- Voice quality rating
  usage_count INTEGER DEFAULT 0,                     -- Track how often voice is used
  last_used_at TIMESTAMP WITH TIME ZONE,             -- Last time voice was used
  metadata JSONB DEFAULT '{}'::jsonb                 -- Additional metadata (flexible)
);

-- Table: saved_phrases
-- Stores frequently used phrases and their generated audio
CREATE TABLE IF NOT EXISTS saved_phrases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_id UUID REFERENCES voices(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  category TEXT DEFAULT 'general',                   -- e.g., 'greeting', 'daily', 'emergency'
  audio_url TEXT,                                    -- Pre-generated audio URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0,                     -- Track phrase popularity
  is_favorite BOOLEAN DEFAULT FALSE                  -- Allow users to favorite phrases
);

-- Table: shared_access
-- Enables family sharing and collaborative access to voices
CREATE TABLE IF NOT EXISTS shared_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_id UUID REFERENCES voices(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_email TEXT,                            -- Optional: specific email
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,               -- Optional expiration
  access_count INTEGER DEFAULT 0,                    -- Track usage
  last_accessed_at TIMESTAMP WITH TIME ZONE,         -- Last access time
  permissions JSONB DEFAULT '{"can_speak": true, "can_edit": false}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE                     -- Allow disabling shares
);

-- Table: voice_usage_logs (NEW)
-- Track voice usage for analytics and billing
CREATE TABLE IF NOT EXISTS voice_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_id UUID REFERENCES voices(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,                              -- 'tts', 'clone', 'share', etc.
  text_length INTEGER,                               -- For TTS requests
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb                 -- Additional context
);

-- ============================================================================
-- INDEXES - Optimized for Voice Library queries
-- ============================================================================

-- Voices table indexes
CREATE INDEX IF NOT EXISTS idx_voices_user_id ON voices(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_voices_is_active ON voices(is_active);
CREATE INDEX IF NOT EXISTS idx_voices_created_at ON voices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voices_voice_id ON voices(voice_id);
CREATE INDEX IF NOT EXISTS idx_voices_last_used ON voices(last_used_at DESC NULLS LAST);

-- Saved phrases indexes
CREATE INDEX IF NOT EXISTS idx_saved_phrases_voice_id ON saved_phrases(voice_id);
CREATE INDEX IF NOT EXISTS idx_saved_phrases_category ON saved_phrases(category);
CREATE INDEX IF NOT EXISTS idx_saved_phrases_is_favorite ON saved_phrases(is_favorite) WHERE is_favorite = true;

-- Shared access indexes
CREATE INDEX IF NOT EXISTS idx_shared_access_token ON shared_access(share_token) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_shared_access_voice_id ON shared_access(voice_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_shared_access_email ON shared_access(shared_with_email);

-- Usage logs indexes
CREATE INDEX IF NOT EXISTS idx_usage_logs_voice_id ON voice_usage_logs(voice_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON voice_usage_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_usage_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Voices Table
-- ============================================================================

-- Allow public access for now (until auth is implemented)
-- When auth is ready, uncomment the user-specific policies below
CREATE POLICY "Allow public read access to active voices"
  ON voices FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow public insert"
  ON voices FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON voices FOR UPDATE
  USING (true);

CREATE POLICY "Allow public soft delete"
  ON voices FOR DELETE
  USING (true);

-- ============================================================================
-- FUTURE AUTH POLICIES (Uncomment when Supabase Auth is enabled)
-- ============================================================================
/*
-- Drop public policies
DROP POLICY IF EXISTS "Allow public read access to active voices" ON voices;
DROP POLICY IF EXISTS "Allow public insert" ON voices;
DROP POLICY IF EXISTS "Allow public update" ON voices;
DROP POLICY IF EXISTS "Allow public soft delete" ON voices;

-- User-specific policies
CREATE POLICY "Users can view their own voices"
  ON voices FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view shared voices"
  ON voices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shared_access
      WHERE shared_access.voice_id = voices.id
      AND shared_access.is_active = true
      AND (shared_access.expires_at IS NULL OR shared_access.expires_at > NOW())
    )
  );

CREATE POLICY "Users can insert their own voices"
  ON voices FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own voices"
  ON voices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voices"
  ON voices FOR DELETE
  USING (auth.uid() = user_id);
*/

-- ============================================================================
-- RLS POLICIES - Saved Phrases Table
-- ============================================================================

CREATE POLICY "Allow public access to saved phrases"
  ON saved_phrases FOR ALL
  USING (true)
  WITH CHECK (true);

/*
-- Future auth policies for saved_phrases
CREATE POLICY "Users can view phrases for their voices"
  ON saved_phrases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = saved_phrases.voice_id
      AND (voices.user_id = auth.uid() OR voices.user_id IS NULL)
    )
  );

CREATE POLICY "Users can manage phrases for their voices"
  ON saved_phrases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = saved_phrases.voice_id
      AND (voices.user_id = auth.uid() OR voices.user_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = saved_phrases.voice_id
      AND (voices.user_id = auth.uid() OR voices.user_id IS NULL)
    )
  );
*/

-- ============================================================================
-- RLS POLICIES - Shared Access Table
-- ============================================================================

CREATE POLICY "Allow public access to shared access"
  ON shared_access FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- RLS POLICIES - Usage Logs Table
-- ============================================================================

CREATE POLICY "Allow insert usage logs"
  ON voice_usage_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own usage logs"
  ON voice_usage_logs FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger: Auto-update updated_at on voices table
DROP TRIGGER IF EXISTS update_voices_updated_at ON voices;
CREATE TRIGGER update_voices_updated_at
  BEFORE UPDATE ON voices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Increment voice usage count
CREATE OR REPLACE FUNCTION increment_voice_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE voices
  SET 
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE id = NEW.voice_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger: Auto-increment usage on TTS
DROP TRIGGER IF EXISTS track_voice_usage ON voice_usage_logs;
CREATE TRIGGER track_voice_usage
  AFTER INSERT ON voice_usage_logs
  FOR EACH ROW
  WHEN (NEW.action = 'tts')
  EXECUTE FUNCTION increment_voice_usage();

-- ============================================================================
-- VIEWS - Useful queries as views
-- ============================================================================

-- View: Active voices with usage stats
CREATE OR REPLACE VIEW active_voices_with_stats AS
SELECT 
  v.id,
  v.user_id,
  v.voice_id,
  v.name,
  v.description,
  v.created_at,
  v.last_used_at,
  v.usage_count,
  v.quality_score,
  COUNT(DISTINCT sp.id) as phrase_count,
  COUNT(DISTINCT sa.id) as share_count
FROM voices v
LEFT JOIN saved_phrases sp ON v.id = sp.voice_id
LEFT JOIN shared_access sa ON v.id = sa.voice_id AND sa.is_active = true
WHERE v.is_active = true
GROUP BY v.id;

-- ============================================================================
-- HELPER QUERIES FOR COMMON OPERATIONS
-- ============================================================================

-- Query 1: Get all active voices for a user (or all if no auth)
-- SELECT * FROM voices WHERE is_active = true ORDER BY created_at DESC;

-- Query 2: Get most recently used voices
-- SELECT * FROM voices WHERE is_active = true ORDER BY last_used_at DESC NULLS LAST LIMIT 10;

-- Query 3: Get voice with all its saved phrases
-- SELECT v.*, json_agg(sp.*) as phrases
-- FROM voices v
-- LEFT JOIN saved_phrases sp ON v.id = sp.voice_id
-- WHERE v.id = 'your-voice-uuid'
-- GROUP BY v.id;

-- Query 4: Get voice usage statistics
-- SELECT 
--   v.name,
--   v.usage_count,
--   COUNT(vul.id) as log_entries,
--   SUM(CASE WHEN vul.action = 'tts' THEN 1 ELSE 0 END) as tts_count
-- FROM voices v
-- LEFT JOIN voice_usage_logs vul ON v.id = vul.voice_id
-- WHERE v.is_active = true
-- GROUP BY v.id, v.name;

-- ============================================================================
-- STORAGE BUCKET CONFIGURATION
-- ============================================================================
-- Run these commands in Supabase Storage Dashboard:
--
-- 1. Create bucket named "recordings"
--    - Public: false
--    - File size limit: 10MB
--    - Allowed MIME types: audio/*
--
-- 2. Create bucket named "generated-audio" (optional, for caching)
--    - Public: true (for easier playback)
--    - File size limit: 5MB
--    - Allowed MIME types: audio/mpeg, audio/mp3
--
-- ============================================================================

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================
/*
-- Insert sample voice
INSERT INTO voices (voice_id, name, description, quality_score)
VALUES ('sample_voice_id', 'Sample Voice', 'This is a test voice', 4);

-- Insert sample phrases
INSERT INTO saved_phrases (voice_id, text, category)
VALUES 
  ((SELECT id FROM voices WHERE voice_id = 'sample_voice_id'), 'Hello, how are you?', 'greeting'),
  ((SELECT id FROM voices WHERE voice_id = 'sample_voice_id'), 'I love you', 'daily'),
  ((SELECT id FROM voices WHERE voice_id = 'sample_voice_id'), 'I need help', 'emergency');
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if all tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('voices', 'saved_phrases', 'shared_access', 'voice_usage_logs')
ORDER BY table_name;

-- Check if all indexes exist
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('voices', 'saved_phrases', 'shared_access', 'voice_usage_logs')
ORDER BY tablename, indexname;

-- Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('voices', 'saved_phrases', 'shared_access', 'voice_usage_logs');

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Clean up old usage logs (run periodically)
-- DELETE FROM voice_usage_logs WHERE created_at < NOW() - INTERVAL '90 days';

-- Find unused voices (no usage in 30 days)
-- SELECT * FROM voices 
-- WHERE is_active = true 
--   AND (last_used_at IS NULL OR last_used_at < NOW() - INTERVAL '30 days');

-- Get database size
-- SELECT 
--   pg_size_pretty(pg_database_size(current_database())) as database_size;

-- ============================================================================
-- COMPLETE! Your database is now ready for the Voice Library system.
-- ============================================================================

