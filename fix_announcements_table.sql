-- Check current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'announcements';

-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can view announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can create announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can update announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can delete announcements" ON announcements;

-- Drop the table to recreate it with correct column types
DROP TABLE IF EXISTS announcements;

-- Recreate the announcements table with correct column types
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'teachers', 'parents')),
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view announcements" ON announcements
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create announcements" ON announcements
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update announcements" ON announcements
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete announcements" ON announcements
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_announcements_updated_at 
    BEFORE UPDATE ON announcements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 