-- Supabase Database Schema for UCED (Unified College Event Dashboard)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'lead', 'advisor', 'hod', 'principal')),
  department TEXT,
  designation TEXT,
  phone TEXT,
  address TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue TEXT NOT NULL,
  category TEXT NOT NULL,
  expected_attendees INTEGER,
  budget DECIMAL(10,2),
  requirements TEXT,
  contact_person TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending_staff_advisor' 
    CHECK (status IN ('pending_staff_advisor', 'pending_hod', 'pending_principal', 'approved', 'rejected')),
  submitted_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approvals table
CREATE TABLE approvals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  reviewed_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('advisor', 'hod', 'principal')),
  status TEXT NOT NULL CHECK (status IN ('approved', 'rejected', 'revision_requested')),
  comment TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  target_audience TEXT NOT NULL DEFAULT 'all' 
    CHECK (target_audience IN ('all', 'students', 'faculty', 'staff')),
  created_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notices table
CREATE TABLE notices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'administrative', 'events', 'facilities', 'technical', 'training')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  target_audience TEXT NOT NULL DEFAULT 'all' 
    CHECK (target_audience IN ('all', 'students', 'faculty', 'staff')),
  posted_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_submitted_by ON events(submitted_by);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_approvals_event_id ON approvals(event_id);
CREATE INDEX idx_approvals_reviewed_by ON approvals(reviewed_by);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_announcements_target_audience ON announcements(target_audience);
CREATE INDEX idx_notices_posted_by ON notices(posted_by);
CREATE INDEX idx_notices_expires_at ON notices(expires_at);
CREATE INDEX idx_notices_target_audience ON notices(target_audience);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Students can view approved events" ON events FOR SELECT 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'student' AND status = 'approved'
    OR (SELECT role FROM users WHERE id = auth.uid()) IN ('lead', 'advisor', 'hod', 'principal')
  );

CREATE POLICY "Community leads can create events" ON events FOR INSERT 
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'lead' AND auth.uid() = submitted_by);

CREATE POLICY "Community leads can update own events" ON events FOR UPDATE 
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'lead' AND auth.uid() = submitted_by);

CREATE POLICY "Staff can update event status" ON events FOR UPDATE 
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('advisor', 'hod', 'principal'));

-- Approvals policies
CREATE POLICY "Staff can view all approvals" ON approvals FOR SELECT 
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('advisor', 'hod', 'principal'));

CREATE POLICY "Staff can create approvals" ON approvals FOR INSERT 
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) IN ('advisor', 'hod', 'principal'));

-- Announcements policies
CREATE POLICY "Everyone can view announcements" ON announcements FOR SELECT USING (true);

CREATE POLICY "HoD and Principal can create announcements" ON announcements FOR INSERT 
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) IN ('hod', 'principal'));

CREATE POLICY "Creators can update own announcements" ON announcements FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete own announcements" ON announcements FOR DELETE 
  USING (auth.uid() = created_by);

-- Notices policies
CREATE POLICY "Everyone can view notices" ON notices FOR SELECT USING (true);

CREATE POLICY "HoD and Principal can create notices" ON notices FOR INSERT 
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) IN ('hod', 'principal'));

CREATE POLICY "Creators can update own notices" ON notices FOR UPDATE 
  USING (auth.uid() = posted_by);

CREATE POLICY "Creators can delete own notices" ON notices FOR DELETE 
  USING (auth.uid() = posted_by);

-- Functions to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- Note: You would need to create users via Supabase Auth first, then update their profiles

-- Sample events (you'll need to replace user IDs with actual ones from your auth.users table)
/*
INSERT INTO events (title, description, date, start_time, end_time, venue, category, expected_attendees, budget, requirements, contact_person, contact_email, contact_phone, submitted_by) VALUES
('Tech Symposium 2024', 'Annual technology symposium featuring latest innovations', '2024-03-15', '09:00', '17:00', 'Main Auditorium', 'Technical', 200, 50000, 'Projector, Sound system, Microphones', 'John Doe', 'john.doe@college.edu', '+91-9876543210', 'user-id-here'),
('Cultural Fest 2024', 'Three-day cultural festival with various competitions', '2024-03-20', '10:00', '18:00', 'College Ground', 'Cultural', 500, 100000, 'Stage setup, Sound system, Lighting', 'Jane Smith', 'jane.smith@college.edu', '+91-9876543211', 'user-id-here');
*/
