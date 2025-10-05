-- Enable user-specific RLS policies
-- Run this AFTER implementing authentication

-- Drop public policies
DROP POLICY IF EXISTS "Allow public read access to active voices" ON voices;
DROP POLICY IF EXISTS "Allow public insert" ON voices;
DROP POLICY IF EXISTS "Allow public update" ON voices;
DROP POLICY IF EXISTS "Allow public soft delete" ON voices;
DROP POLICY IF EXISTS "Allow public access to saved phrases" ON saved_phrases;
DROP POLICY IF EXISTS "Allow public access to shared access" ON shared_access;

-- Create user-specific policies for voices
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

-- Policies for saved_phrases
CREATE POLICY "Users can view phrases for their voices"
  ON saved_phrases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = saved_phrases.voice_id
      AND voices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage phrases for their voices"
  ON saved_phrases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = saved_phrases.voice_id
      AND voices.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = saved_phrases.voice_id
      AND voices.user_id = auth.uid()
    )
  );

-- Policies for shared_access
CREATE POLICY "Users can view their own shares"
  ON shared_access FOR SELECT
  USING (shared_by = auth.uid());

CREATE POLICY "Users can create shares for their voices"
  ON shared_access FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voices
      WHERE voices.id = shared_access.voice_id
      AND voices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own shares"
  ON shared_access FOR UPDATE
  USING (shared_by = auth.uid());

CREATE POLICY "Users can delete their own shares"
  ON shared_access FOR DELETE
  USING (shared_by = auth.uid());

