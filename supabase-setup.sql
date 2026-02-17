-- ================================================
-- Smart Bookmark Manager - Database Setup
-- ================================================
-- Run this script in Supabase SQL Editor
-- This will create the bookmarks table with proper security

-- 1. Create the bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Policy: Users can view only their own bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert only their own bookmarks
CREATE POLICY "Users can insert their own bookmarks" 
ON bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own bookmarks
CREATE POLICY "Users can update their own bookmarks" 
ON bookmarks 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" 
ON bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON bookmarks(created_at DESC);

-- 5. Add helpful comments
COMMENT ON TABLE bookmarks IS 'Stores user bookmarks with URLs and titles';
COMMENT ON COLUMN bookmarks.id IS 'Unique identifier for each bookmark';
COMMENT ON COLUMN bookmarks.user_id IS 'References the user who owns this bookmark';
COMMENT ON COLUMN bookmarks.title IS 'Display title for the bookmark';
COMMENT ON COLUMN bookmarks.url IS 'The URL being bookmarked';
COMMENT ON COLUMN bookmarks.created_at IS 'Timestamp when bookmark was created';

-- ================================================
-- Setup Complete! ✅
-- ================================================
-- Next Steps:
-- 1. Go to Database → Replication
-- 2. Find 'bookmarks' table
-- 3. Enable Realtime replication
-- ================================================
