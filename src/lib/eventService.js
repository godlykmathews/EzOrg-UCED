import { supabase, TABLES, EVENT_STATUS, APPROVAL_STATUS } from './supabase'

export class EventService {
  // Create a new event
  static async createEvent(eventData, userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .insert([
          {
            ...eventData,
            submitted_by: userId,
            status: EVENT_STATUS.PENDING_STAFF_ADVISOR,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select(`
          *,
          submitter:users!submitted_by(name, email, role)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get all events with optional filtering
  static async getEvents(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.EVENTS)
        .select(`
          *,
          submitter:users!submitted_by(name, email, role)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.submittedBy) {
        query = query.eq('submitted_by', filters.submittedBy)
      }

      if (filters.userRole === 'student') {
        // Students can only see approved events
        query = query.eq('status', EVENT_STATUS.APPROVED)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get event by ID
  static async getEventById(eventId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select(`
          *,
          submitter:users!submitted_by(name, email, role)
        `)
        .eq('id', eventId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update event
  static async updateEvent(eventId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select(`
          *,
          submitter:users!submitted_by(name, email, role)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete event
  static async deleteEvent(eventId) {
    try {
      const { error } = await supabase
        .from(TABLES.EVENTS)
        .delete()
        .eq('id', eventId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Get events pending approval for specific role
  static async getPendingApprovalsForRole(role) {
    try {
      let statusFilter
      switch (role) {
        case 'advisor':
          statusFilter = EVENT_STATUS.PENDING_STAFF_ADVISOR
          break
        case 'hod':
          statusFilter = EVENT_STATUS.PENDING_HOD
          break
        case 'principal':
          statusFilter = EVENT_STATUS.PENDING_PRINCIPAL
          break
        default:
          throw new Error('Invalid role for approvals')
      }

      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select(`
          *,
          submitter:users!submitted_by(name, email, role)
        `)
        .eq('status', statusFilter)
        .order('created_at', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get event statistics
  static async getEventStats(userId = null, userRole = null) {
    try {
      let totalEventsQuery = supabase
        .from(TABLES.EVENTS)
        .select('*', { count: 'exact', head: true })

      let approvedEventsQuery = supabase
        .from(TABLES.EVENTS)
        .select('*', { count: 'exact', head: true })
        .eq('status', EVENT_STATUS.APPROVED)

      let pendingEventsQuery = supabase
        .from(TABLES.EVENTS)
        .select('*', { count: 'exact', head: true })
        .neq('status', EVENT_STATUS.APPROVED)
        .neq('status', EVENT_STATUS.REJECTED)

      // Filter by user if provided
      if (userId && userRole === 'lead') {
        totalEventsQuery = totalEventsQuery.eq('submitted_by', userId)
        approvedEventsQuery = approvedEventsQuery.eq('submitted_by', userId)
        pendingEventsQuery = pendingEventsQuery.eq('submitted_by', userId)
      }

      const [totalResult, approvedResult, pendingResult] = await Promise.all([
        totalEventsQuery,
        approvedEventsQuery,
        pendingEventsQuery
      ])

      return {
        data: {
          totalEvents: totalResult.count || 0,
          approvedEvents: approvedResult.count || 0,
          pendingEvents: pendingResult.count || 0
        },
        error: null
      }
    } catch (error) {
      return { data: null, error }
    }
  }
}
