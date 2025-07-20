import { supabase, TABLES } from './supabase'

export class ProfileService {
  // Get user profile with statistics
  static async getUserProfileWithStats(userId) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      // Get activity statistics based on role
      const stats = await this.getActivityStats(userId, profile.role)

      return { 
        data: { ...profile, stats }, 
        error: null 
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get activity statistics for a user
  static async getActivityStats(userId, userRole) {
    try {
      const stats = {}

      switch (userRole) {
        case 'student':
        case 'lead':
          // Get events created by user
          const { data: createdEvents } = await supabase
            .from(TABLES.EVENTS)
            .select('id, status')
            .eq('submitted_by', userId)

          const { data: attendedEvents } = await supabase
            .from('event_attendees')
            .select('event_id')
            .eq('user_id', userId)

          stats.eventsCreated = createdEvents?.length || 0
          stats.eventsApproved = createdEvents?.filter(e => e.status === 'approved').length || 0
          stats.eventsAttended = attendedEvents?.length || 0
          break

        case 'advisor':
        case 'hod':
        case 'principal':
          // Get approvals by user
          const { data: approvals } = await supabase
            .from(TABLES.APPROVALS)
            .select('id, status')
            .eq('approved_by', userId)

          const { data: announcements } = await supabase
            .from(TABLES.ANNOUNCEMENTS)
            .select('id')
            .eq('created_by', userId)

          stats.approvalsGiven = approvals?.length || 0
          stats.eventsApproved = approvals?.filter(a => a.status === 'approved').length || 0
          stats.announcementsMade = announcements?.length || 0
          break

        default:
          stats.eventsCreated = 0
          stats.eventsApproved = 0
          stats.eventsAttended = 0
      }

      return stats
    } catch (error) {
      console.error('Error fetching activity stats:', error)
      return {}
    }
  }

  // Update user preferences
  static async updateUserPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({ 
          preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Upload user avatar
  static async uploadAvatar(userId, file) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/avatar.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update user profile with avatar URL
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return { data: { ...data, avatar_url: publicUrl }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Search users (for admin purposes)
  static async searchUsers(query, role = null) {
    try {
      let queryBuilder = supabase
        .from(TABLES.USERS)
        .select('id, name, email, role, department, designation')

      if (role) {
        queryBuilder = queryBuilder.eq('role', role)
      }

      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,email.ilike.%${query}%,department.ilike.%${query}%`)
      }

      const { data, error } = await queryBuilder
        .order('name')
        .limit(50)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}