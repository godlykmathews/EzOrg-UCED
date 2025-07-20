-- First, let's check if the table exists and see its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'announcements';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'announcements';

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can view announcements" ON announcements;
DROP POLICY IF EXISTS "HOD and Principal can create announcements" ON announcements;
DROP POLICY IF EXISTS "HOD and Principal can update announcements" ON announcements;
DROP POLICY IF EXISTS "HOD and Principal can delete announcements" ON announcements;

-- Temporarily disable RLS to test
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create simpler policies that should work
-- Allow all authenticated users to read announcements
CREATE POLICY "Anyone can view announcements" ON announcements
  FOR SELECT
  USING (true);

-- Allow authenticated users to create announcements (we'll filter by role in the app)
CREATE POLICY "Authenticated users can create announcements" ON announcements
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update announcements (we'll filter by role in the app)
CREATE POLICY "Authenticated users can update announcements" ON announcements
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete announcements (we'll filter by role in the app)
CREATE POLICY "Authenticated users can delete announcements" ON announcements
  FOR DELETE
  USING (auth.role() = 'authenticated'); 