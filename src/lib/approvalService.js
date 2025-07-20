import { supabase, TABLES, EVENT_STATUS, APPROVAL_STATUS } from './supabase'
import { EventService } from './eventService'

export class ApprovalService {
  // Create an approval record
  static async createApproval(eventId, reviewerId, role, status, comment = null) {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPROVALS)
        .insert([
          {
            event_id: eventId,
            reviewed_by: reviewerId,
            role: role,
            status: status,
            comment: comment,
            reviewed_at: new Date().toISOString()
          }
        ])
        .select(`
          *,
          reviewer:users!reviewed_by(name, email, role),
          event:events(title, submitted_by)
        `)
        .single()

      if (error) throw error

      // Update event status based on approval
      if (status === APPROVAL_STATUS.APPROVED) {
        await this.updateEventStatusAfterApproval(eventId, role)
      } else if (status === APPROVAL_STATUS.REJECTED) {
        await EventService.updateEvent(eventId, { status: EVENT_STATUS.REJECTED })
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update event status after approval
  static async updateEventStatusAfterApproval(eventId, approverRole) {
    try {
      let newStatus
      
      switch (approverRole) {
        case 'advisor':
          newStatus = EVENT_STATUS.PENDING_HOD
          break
        case 'hod':
          newStatus = EVENT_STATUS.PENDING_PRINCIPAL
          break
        case 'principal':
          newStatus = EVENT_STATUS.APPROVED
          break
        default:
          throw new Error('Invalid approver role')
      }

      return await EventService.updateEvent(eventId, { status: newStatus })
    } catch (error) {
      return { error }
    }
  }

  // Get approvals for an event
  static async getApprovalsForEvent(eventId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPROVALS)
        .select(`
          *,
          reviewer:users!reviewed_by(name, email, role)
        `)
        .eq('event_id', eventId)
        .order('reviewed_at', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get approval history for a user
  static async getApprovalHistory(userId, role) {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPROVALS)
        .select(`
          *,
          event:events(title, description, date, venue, submitted_by),
          submitter:events!inner(submitter:users!submitted_by(name, email))
        `)
        .eq('reviewed_by', userId)
        .eq('role', role)
        .order('reviewed_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get pending approvals for a user based on their role
  static async getPendingApprovals(userId, role) {
    try {
      // Get events that need approval from this role
      const eventResult = await EventService.getPendingApprovalsForRole(role)
      
      if (eventResult.error) {
        return eventResult
      }

      // For each event, check if this user has already approved it
      const eventsWithApprovalStatus = await Promise.all(
        eventResult.data.map(async (event) => {
          const { data: existingApproval } = await supabase
            .from(TABLES.APPROVALS)
            .select('*')
            .eq('event_id', event.id)
            .eq('reviewed_by', userId)
            .eq('role', role)
            .single()

          return {
            ...event,
            hasUserApproved: !!existingApproval
          }
        })
      )

      // Filter out events already approved by this user
      const pendingEvents = eventsWithApprovalStatus.filter(event => !event.hasUserApproved)

      return { data: pendingEvents, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get approval statistics for a user
  static async getApprovalStats(userId, role) {
    try {
      const [approvedResult, rejectedResult, pendingResult] = await Promise.all([
        supabase
          .from(TABLES.APPROVALS)
          .select('*', { count: 'exact', head: true })
          .eq('reviewed_by', userId)
          .eq('role', role)
          .eq('status', APPROVAL_STATUS.APPROVED),
        
        supabase
          .from(TABLES.APPROVALS)
          .select('*', { count: 'exact', head: true })
          .eq('reviewed_by', userId)
          .eq('role', role)
          .eq('status', APPROVAL_STATUS.REJECTED),
        
        EventService.getPendingApprovalsForRole(role)
      ])

      return {
        data: {
          approved: approvedResult.count || 0,
          rejected: rejectedResult.count || 0,
          pending: pendingResult.data?.length || 0
        },
        error: null
      }
    } catch (error) {
      return { data: null, error }
    }
  }
}
