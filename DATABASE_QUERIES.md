# 📊 Database Queries - Quick Reference

## Table of Contents
- [Setup & Verification](#setup--verification)
- [Voice Queries](#voice-queries)
- [Phrase Queries](#phrase-queries)
- [Sharing Queries](#sharing-queries)
- [Analytics Queries](#analytics-queries)
- [Maintenance Queries](#maintenance-queries)

---

## 🚀 Setup & Verification

### Check if Tables Exist
```sql
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('voices', 'saved_phrases', 'shared_access', 'voice_usage_logs')
ORDER BY table_name;
```

### Check Indexes
```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('voices', 'saved_phrases', 'shared_access', 'voice_usage_logs')
ORDER BY tablename, indexname;
```

### Check RLS Status
```sql
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('voices', 'saved_phrases', 'shared_access', 'voice_usage_logs');
```

### Verify Database Setup
```sql
-- Should return 4 tables
SELECT COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('voices', 'saved_phrases', 'shared_access', 'voice_usage_logs');
```

---

## 🎙️ Voice Queries

### Get All Active Voices
```sql
SELECT * FROM voices 
WHERE is_active = true 
ORDER BY created_at DESC;
```

### Get Voice by ID
```sql
SELECT * FROM voices 
WHERE id = 'your-voice-uuid';
```

### Get Voice by ElevenLabs Voice ID
```sql
SELECT * FROM voices 
WHERE voice_id = 'elevenlabs-voice-id';
```

### Get Most Recently Used Voices
```sql
SELECT * FROM voices 
WHERE is_active = true 
ORDER BY last_used_at DESC NULLS LAST 
LIMIT 10;
```

### Get Most Popular Voices
```sql
SELECT 
  id,
  name,
  usage_count,
  last_used_at
FROM voices 
WHERE is_active = true 
ORDER BY usage_count DESC 
LIMIT 10;
```

### Get Voice with Stats
```sql
SELECT * FROM active_voices_with_stats
ORDER BY created_at DESC;
```

### Search Voices by Name
```sql
SELECT * FROM voices 
WHERE is_active = true 
  AND name ILIKE '%search-term%'
ORDER BY created_at DESC;
```

### Get User's Voices (when auth enabled)
```sql
SELECT * FROM voices 
WHERE user_id = 'user-uuid' 
  AND is_active = true 
ORDER BY created_at DESC;
```

### Insert New Voice
```sql
INSERT INTO voices (
  user_id, 
  voice_id, 
  name, 
  description,
  quality_score
)
VALUES (
  NULL,  -- or user UUID
  'elevenlabs-voice-id',
  'My Voice',
  'Voice recorded on 2025-10-05',
  5
)
RETURNING *;
```

### Update Voice Name
```sql
UPDATE voices 
SET name = 'New Voice Name',
    updated_at = NOW()
WHERE id = 'voice-uuid'
RETURNING *;
```

### Soft Delete Voice
```sql
UPDATE voices 
SET is_active = false,
    updated_at = NOW()
WHERE id = 'voice-uuid';
```

### Hard Delete Voice (use with caution!)
```sql
DELETE FROM voices 
WHERE id = 'voice-uuid';
-- This will cascade delete all associated data
```

### Restore Soft-Deleted Voice
```sql
UPDATE voices 
SET is_active = true,
    updated_at = NOW()
WHERE id = 'voice-uuid';
```

---

## 💬 Phrase Queries

### Get All Phrases for a Voice
```sql
SELECT * FROM saved_phrases 
WHERE voice_id = 'voice-uuid'
ORDER BY created_at DESC;
```

### Get Favorite Phrases
```sql
SELECT * FROM saved_phrases 
WHERE voice_id = 'voice-uuid' 
  AND is_favorite = true
ORDER BY usage_count DESC;
```

### Get Phrases by Category
```sql
SELECT * FROM saved_phrases 
WHERE voice_id = 'voice-uuid' 
  AND category = 'emergency'
ORDER BY created_at DESC;
```

### Get Most Used Phrases
```sql
SELECT 
  text,
  category,
  usage_count
FROM saved_phrases 
WHERE voice_id = 'voice-uuid'
ORDER BY usage_count DESC
LIMIT 10;
```

### Insert New Phrase
```sql
INSERT INTO saved_phrases (
  voice_id,
  text,
  category,
  audio_url,
  is_favorite
)
VALUES (
  'voice-uuid',
  'Hello, how are you?',
  'greeting',
  'https://storage.url/audio.mp3',
  false
)
RETURNING *;
```

### Update Phrase
```sql
UPDATE saved_phrases 
SET text = 'Updated text',
    category = 'daily'
WHERE id = 'phrase-uuid'
RETURNING *;
```

### Mark Phrase as Favorite
```sql
UPDATE saved_phrases 
SET is_favorite = true
WHERE id = 'phrase-uuid';
```

### Delete Phrase
```sql
DELETE FROM saved_phrases 
WHERE id = 'phrase-uuid';
```

### Get Voice with All Phrases (JSON)
```sql
SELECT 
  v.*,
  json_agg(
    json_build_object(
      'id', sp.id,
      'text', sp.text,
      'category', sp.category,
      'usage_count', sp.usage_count
    )
  ) as phrases
FROM voices v
LEFT JOIN saved_phrases sp ON v.id = sp.voice_id
WHERE v.id = 'voice-uuid'
GROUP BY v.id;
```

---

## 🔗 Sharing Queries

### Get Active Shares for Voice
```sql
SELECT * FROM shared_access 
WHERE voice_id = 'voice-uuid' 
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY created_at DESC;
```

### Get Share by Token
```sql
SELECT * FROM shared_access 
WHERE share_token = 'share-token-here'
  AND is_active = true;
```

### Create Share Link
```sql
INSERT INTO shared_access (
  voice_id,
  shared_by,
  shared_with_email,
  expires_at,
  permissions
)
VALUES (
  'voice-uuid',
  'user-uuid',
  'family@example.com',
  NOW() + INTERVAL '30 days',
  '{"can_speak": true, "can_edit": false}'::jsonb
)
RETURNING share_token;
```

### Revoke Share
```sql
UPDATE shared_access 
SET is_active = false
WHERE id = 'share-uuid';
```

### Increment Share Access Count
```sql
UPDATE shared_access 
SET access_count = access_count + 1,
    last_accessed_at = NOW()
WHERE share_token = 'share-token';
```

### Get Expired Shares
```sql
SELECT * FROM shared_access 
WHERE expires_at < NOW() 
  AND is_active = true;
```

### Clean Up Expired Shares
```sql
UPDATE shared_access 
SET is_active = false
WHERE expires_at < NOW() 
  AND is_active = true;
```

---

## 📈 Analytics Queries

### Voice Usage Statistics
```sql
SELECT 
  v.name,
  v.usage_count,
  v.last_used_at,
  COUNT(vul.id) as total_actions,
  SUM(CASE WHEN vul.action = 'tts' THEN 1 ELSE 0 END) as tts_count,
  SUM(CASE WHEN vul.action = 'clone' THEN 1 ELSE 0 END) as clone_count
FROM voices v
LEFT JOIN voice_usage_logs vul ON v.id = vul.voice_id
WHERE v.is_active = true
GROUP BY v.id, v.name, v.usage_count, v.last_used_at
ORDER BY v.usage_count DESC;
```

### Daily Voice Usage
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as usage_count,
  COUNT(DISTINCT voice_id) as unique_voices
FROM voice_usage_logs
WHERE action = 'tts'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Most Active Users (when auth enabled)
```sql
SELECT 
  user_id,
  COUNT(*) as action_count,
  COUNT(DISTINCT voice_id) as voices_used
FROM voice_usage_logs
WHERE user_id IS NOT NULL
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY user_id
ORDER BY action_count DESC
LIMIT 10;
```

### Average Text Length per Voice
```sql
SELECT 
  v.name,
  AVG(vul.text_length) as avg_text_length,
  COUNT(vul.id) as tts_count
FROM voices v
INNER JOIN voice_usage_logs vul ON v.id = vul.voice_id
WHERE vul.action = 'tts'
  AND vul.text_length IS NOT NULL
GROUP BY v.id, v.name
ORDER BY tts_count DESC;
```

### Voice Growth Over Time
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as voices_created
FROM voices
GROUP BY month
ORDER BY month DESC;
```

### Phrase Popularity by Category
```sql
SELECT 
  category,
  COUNT(*) as phrase_count,
  SUM(usage_count) as total_usage
FROM saved_phrases
GROUP BY category
ORDER BY total_usage DESC;
```

---

## 🔧 Maintenance Queries

### Find Unused Voices (30+ days)
```sql
SELECT 
  id,
  name,
  created_at,
  last_used_at,
  usage_count
FROM voices 
WHERE is_active = true 
  AND (last_used_at IS NULL OR last_used_at < NOW() - INTERVAL '30 days')
ORDER BY created_at DESC;
```

### Clean Up Old Usage Logs (90+ days)
```sql
DELETE FROM voice_usage_logs 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Get Database Size
```sql
SELECT pg_size_pretty(pg_database_size(current_database())) as database_size;
```

### Get Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('voices', 'saved_phrases', 'shared_access', 'voice_usage_logs')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Count Records per Table
```sql
SELECT 
  'voices' as table_name, 
  COUNT(*) as record_count,
  COUNT(*) FILTER (WHERE is_active = true) as active_count
FROM voices
UNION ALL
SELECT 
  'saved_phrases',
  COUNT(*),
  NULL
FROM saved_phrases
UNION ALL
SELECT 
  'shared_access',
  COUNT(*),
  COUNT(*) FILTER (WHERE is_active = true)
FROM shared_access
UNION ALL
SELECT 
  'voice_usage_logs',
  COUNT(*),
  NULL
FROM voice_usage_logs;
```

### Find Duplicate Voice Names
```sql
SELECT 
  name,
  COUNT(*) as count
FROM voices
WHERE is_active = true
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY count DESC;
```

### Find Orphaned Phrases (voices deleted)
```sql
SELECT sp.*
FROM saved_phrases sp
LEFT JOIN voices v ON sp.voice_id = v.id
WHERE v.id IS NULL;
```

### Vacuum and Analyze (optimize performance)
```sql
VACUUM ANALYZE voices;
VACUUM ANALYZE saved_phrases;
VACUUM ANALYZE shared_access;
VACUUM ANALYZE voice_usage_logs;
```

---

## 🔍 Advanced Queries

### Full-Text Search on Voice Names
```sql
SELECT 
  id,
  name,
  description,
  ts_rank(
    to_tsvector('english', name || ' ' || COALESCE(description, '')),
    to_tsquery('english', 'search-term')
  ) as rank
FROM voices
WHERE to_tsvector('english', name || ' ' || COALESCE(description, '')) 
  @@ to_tsquery('english', 'search-term')
  AND is_active = true
ORDER BY rank DESC;
```

### Voice Engagement Score
```sql
SELECT 
  v.id,
  v.name,
  v.usage_count,
  COUNT(DISTINCT sp.id) as phrase_count,
  COUNT(DISTINCT sa.id) as share_count,
  (v.usage_count + COUNT(DISTINCT sp.id) * 2 + COUNT(DISTINCT sa.id) * 3) as engagement_score
FROM voices v
LEFT JOIN saved_phrases sp ON v.id = sp.voice_id
LEFT JOIN shared_access sa ON v.id = sa.voice_id
WHERE v.is_active = true
GROUP BY v.id, v.name, v.usage_count
ORDER BY engagement_score DESC;
```

### Recently Active Voices (last 7 days)
```sql
SELECT DISTINCT ON (v.id)
  v.id,
  v.name,
  v.last_used_at,
  vul.action,
  vul.created_at as last_action_at
FROM voices v
INNER JOIN voice_usage_logs vul ON v.id = vul.voice_id
WHERE vul.created_at > NOW() - INTERVAL '7 days'
  AND v.is_active = true
ORDER BY v.id, vul.created_at DESC;
```

---

## 🎯 Quick Actions

### Complete Voice Deletion (all related data)
```sql
-- This will cascade delete phrases, shares, and logs
DELETE FROM voices WHERE id = 'voice-uuid';
```

### Clone Voice Metadata (not audio)
```sql
INSERT INTO voices (
  user_id,
  voice_id,
  name,
  description,
  quality_score
)
SELECT 
  user_id,
  'new-elevenlabs-id',
  name || ' (Copy)',
  description,
  quality_score
FROM voices
WHERE id = 'source-voice-uuid'
RETURNING *;
```

### Batch Update Voice Quality
```sql
UPDATE voices 
SET quality_score = 5
WHERE usage_count > 100 
  AND is_active = true;
```

### Export Voice List (JSON)
```sql
SELECT json_agg(
  json_build_object(
    'id', id,
    'name', name,
    'voice_id', voice_id,
    'created_at', created_at,
    'usage_count', usage_count
  )
)
FROM voices
WHERE is_active = true;
```

---

## 📝 Notes

- All queries use `is_active = true` to exclude soft-deleted records
- Replace `'voice-uuid'`, `'user-uuid'`, etc. with actual UUIDs
- Use transactions for important updates
- Always backup before running DELETE or UPDATE on production
- Add `LIMIT` clauses for large tables
- Indexes are optimized for these common queries

---

## 🆘 Emergency Queries

### Restore All Deleted Voices (use with caution!)
```sql
UPDATE voices 
SET is_active = true 
WHERE is_active = false 
  AND updated_at > NOW() - INTERVAL '7 days';
```

### Find All Data for a Specific Voice
```sql
-- Voice
SELECT * FROM voices WHERE id = 'voice-uuid';

-- Phrases
SELECT * FROM saved_phrases WHERE voice_id = 'voice-uuid';

-- Shares
SELECT * FROM shared_access WHERE voice_id = 'voice-uuid';

-- Usage logs
SELECT * FROM voice_usage_logs WHERE voice_id = 'voice-uuid' LIMIT 100;
```

---

**💡 Tip**: Save frequently used queries as Supabase SQL Snippets for quick access!

