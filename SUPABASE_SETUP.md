# Supabase Integration Setup Guide

This guide will help you set up Supabase for the UCED (Unified College Event Dashboard) project.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- The UCED frontend project

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - **Name**: UCED or Unified College Event Dashboard
   - **Database Password**: Choose a secure password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Find your:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. In your UCED project root, edit the `.env.local` file:

```env
# Replace with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Save the file

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `database/schema.sql` in this project
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema
5. This will create all necessary tables, indexes, and security policies

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

### Email Settings
- **Enable email confirmations**: Turn this ON for production, OFF for development
- **Enable email invites**: Turn this ON if you want to invite users

### Security Settings
- **Enable phone confirmations**: OFF (unless you need phone auth)
- **Enable email change confirmations**: ON
- **Enable manual linking**: OFF

### Auth Providers
- **Email**: Enabled (default)
- You can also enable other providers like Google, GitHub, etc. if needed

## Step 6: Set Up Row Level Security (RLS)

The schema already includes RLS policies, but here's what they do:

### Users Table
- Users can view all profiles
- Users can only update their own profile
- New users can insert their own profile

### Events Table
- Students can only view approved events
- Community leads can create and update their own events
- Staff (advisor, hod, principal) can update event status

### Other Tables
- Similar role-based access control for approvals, announcements, and notices

## Step 7: Enable Realtime (Optional)

For real-time updates:

1. Go to **Database** → **Replication**
2. Enable realtime for these tables:
   - `events`
   - `approvals`
   - `announcements`
   - `notices`

## Step 8: Create Test Users

### Option 1: Through the Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Fill in email and password
4. After creating the auth user, you'll need to add their profile to the `users` table

### Option 2: Through the Application
1. Use the Sign Up form in the application
2. The app will automatically create both the auth user and the profile

### Option 3: SQL Insert (for testing)
```sql
-- First, create an auth user through the dashboard or app
-- Then insert into users table with the auth user's ID

INSERT INTO users (id, name, email, role, department) VALUES 
(
  'auth-user-id-here',  -- Replace with actual auth user ID
  'John Doe',
  'john.doe@college.edu',
  'lead',
  'Computer Science'
);
```

## Step 9: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to `http://localhost:5174`

3. Try the following:
   - Sign up with a new account
   - Sign in with existing credentials
   - Create an event (as a Community Lead)
   - Approve events (as Staff/HoD/Principal)
   - Create announcements (as HoD/Principal)

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure your `.env.local` file has the correct variables and restart your dev server.

### Issue: "No profiles found" after login
**Solution**: Check that the user profile was created in the `users` table. The sign-up process should do this automatically.

### Issue: RLS Policy errors
**Solution**: Make sure you've run the complete schema from `database/schema.sql` including all the policies.

### Issue: Users can't see their own events
**Solution**: Check that the user's role in the `users` table matches their intended permissions.

## Database Schema Overview

### Tables Created:
- **users**: User profiles extending Supabase auth
- **events**: Event proposals and details
- **approvals**: Approval workflow records
- **announcements**: College announcements
- **notices**: Notice board items

### Key Features:
- **UUID primary keys** for all tables
- **Foreign key relationships** linking users to their content
- **Enum constraints** for roles, statuses, priorities
- **Automatic timestamps** with triggers
- **Row Level Security** for data protection
- **Indexes** for query performance

## API Usage Examples

### Get User Profile
```javascript
import { supabase } from './src/lib/supabase'

const { data: profile } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

### Create Event
```javascript
const { data: event } = await supabase
  .from('events')
  .insert([eventData])
  .select()
  .single()
```

### Get Events for User Role
```javascript
const { data: events } = await supabase
  .from('events')
  .select(`
    *,
    submitter:users!submitted_by(name, email, role)
  `)
  .eq('status', 'approved') // For students
  .order('created_at', { ascending: false })
```

## Security Best Practices

1. **Never expose your service_role key** in frontend code
2. **Use RLS policies** to control data access
3. **Validate user roles** before allowing operations
4. **Use HTTPS** in production
5. **Enable email confirmation** for production
6. **Regularly audit user permissions**

## Deployment Notes

When deploying to production:

1. Update your `.env.local` with production Supabase credentials
2. Enable email confirmation in Supabase Auth settings
3. Configure your domain in Supabase Auth settings
4. Set up proper CORS policies if needed
5. Monitor your database usage and performance

## Support

If you encounter issues:

1. Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Review the browser console for error messages
3. Check the Supabase dashboard logs
4. Ensure your schema was applied correctly

## Development vs Production

### Development Setup:
- Email confirmation: OFF
- Relaxed CORS policies
- Test data in database

### Production Setup:
- Email confirmation: ON
- Strict security policies
- Backup strategies
- Performance monitoring
