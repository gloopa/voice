-- Migration: Add new columns to existing voices table
-- Run this if you already have a voices table

-- Add new columns to voices table
ALTER TABLE voices ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE voices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE voices ADD COLUMN IF NOT EXISTS quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5);
ALTER TABLE voices ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;
ALTER TABLE voices ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE voices ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add new columns to saved_phrases table
ALTER TABLE saved_phrases ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;
ALTER TABLE saved_phrases ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Add new columns to shared_access table
ALTER TABLE shared_access ADD COLUMN IF NOT EXISTS shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE shared_access ADD COLUMN IF NOT EXISTS shared_with_email TEXT;
ALTER TABLE shared_access ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE shared_access ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"can_speak": true, "can_edit": false}'::jsonb;
ALTER TABLE shared_access ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create new table: voice_usage_logs
CREATE TABLE IF NOT EXISTS voice_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_id UUID REFERENCES voices(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  text_length INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add new indexes
CREATE INDEX IF NOT EXISTS idx_voices_is_active ON voices(is_active);
CREATE INDEX IF NOT EXISTS idx_voices_created_at ON voices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voices_voice_id ON voices(voice_id);
CREATE INDEX IF NOT EXISTS idx_voices_last_used ON voices(last_used_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_saved_phrases_category ON saved_phrases(category);
CREATE INDEX IF NOT EXISTS idx_saved_phrases_is_favorite ON saved_phrases(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_shared_access_voice_id ON shared_access(voice_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_shared_access_email ON shared_access(shared_with_email);
CREATE INDEX IF NOT EXISTS idx_usage_logs_voice_id ON voice_usage_logs(voice_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON voice_usage_logs(created_at DESC);

-- Enable RLS on new table
ALTER TABLE voice_usage_logs ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for usage logs
CREATE POLICY "Allow insert usage logs"
  ON voice_usage_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own usage logs"
  ON voice_usage_logs FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to voices table
DROP TRIGGER IF EXISTS update_voices_updated_at ON voices;
CREATE TRIGGER update_voices_updated_at
  BEFORE UPDATE ON voices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function for incrementing usage
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

-- Add trigger for usage tracking
DROP TRIGGER IF EXISTS track_voice_usage ON voice_usage_logs;
CREATE TRIGGER track_voice_usage
  AFTER INSERT ON voice_usage_logs
  FOR EACH ROW
  WHEN (NEW.action = 'tts')
  EXECUTE FUNCTION increment_voice_usage();

-- Create view
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

