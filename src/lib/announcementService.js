import { supabase, TABLES } from './supabase'

export class AnnouncementService {
  // Create a new announcement
  static async createAnnouncement(announcementData, userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .insert([
          {
            ...announcementData,
            created_by: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select(`
          *,
          creator:users!created_by(name, email, role)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get all announcements with optional filtering
  static async getAnnouncements(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.ANNOUNCEMENTS)
        .select(`
          *,
          creator:users!created_by(name, email, role)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.priority) {
        query = query.eq('priority', filters.priority)
      }

      if (filters.targetAudience) {
        query = query.eq('target_audience', filters.targetAudience)
      }

      if (filters.createdBy) {
        query = query.eq('created_by', filters.createdBy)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get announcement by ID
  static async getAnnouncementById(announcementId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .select(`
          *,
          creator:users!created_by(name, email, role)
        `)
        .eq('id', announcementId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update announcement
  static async updateAnnouncement(announcementId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', announcementId)
        .select(`
          *,
          creator:users!created_by(name, email, role)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete announcement
  static async deleteAnnouncement(announcementId) {
    try {
      const { error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .delete()
        .eq('id', announcementId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Get announcements for specific user role
  static async getAnnouncementsForRole(userRole) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .select(`
          *,
          creator:users!created_by(name, email, role)
        `)
        .or(`target_audience.eq.all,target_audience.eq.${userRole}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

export class NoticeService {
  // Create a new notice
  static async createNotice(noticeData, userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTICES)
        .insert([
          {
            ...noticeData,
            posted_by: userId,
            posted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select(`
          *,
          poster:users!posted_by(name, email, role)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get all notices with optional filtering
  static async getNotices(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.NOTICES)
        .select(`
          *,
          poster:users!posted_by(name, email, role)
        `)
        .order('posted_at', { ascending: false })

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.priority) {
        query = query.eq('priority', filters.priority)
      }

      if (filters.targetAudience) {
        query = query.eq('target_audience', filters.targetAudience)
      }

      if (filters.excludeExpired) {
        const now = new Date().toISOString()
        query = query.gt('expires_at', now)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get notices for specific user role (excluding expired ones)
  static async getNoticesForRole(userRole) {
    try {
      const now = new Date().toISOString()
      
      const { data, error } = await supabase
        .from(TABLES.NOTICES)
        .select(`
          *,
          poster:users!posted_by(name, email, role)
        `)
        .or(`target_audience.eq.all,target_audience.eq.${userRole}`)
        .gt('expires_at', now)
        .order('posted_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update notice
  static async updateNotice(noticeId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTICES)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', noticeId)
        .select(`
          *,
          poster:users!posted_by(name, email, role)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete notice
  static async deleteNotice(noticeId) {
    try {
      const { error } = await supabase
        .from(TABLES.NOTICES)
        .delete()
        .eq('id', noticeId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }
}
