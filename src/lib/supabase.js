import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USERS: 'users',
  EVENTS: 'events',
  APPROVALS: 'approvals',
  ANNOUNCEMENTS: 'announcements',
  NOTICES: 'notices'
}

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  LEAD: 'lead',
  ADVISOR: 'advisor',
  HOD: 'hod',
  PRINCIPAL: 'principal'
}

// Event statuses
export const EVENT_STATUS = {
  PENDING_STAFF_ADVISOR: 'pending_staff_advisor',
  PENDING_HOD: 'pending_hod',
  PENDING_PRINCIPAL: 'pending_principal',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

// Approval statuses
export const APPROVAL_STATUS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISION_REQUESTED: 'revision_requested'
}
