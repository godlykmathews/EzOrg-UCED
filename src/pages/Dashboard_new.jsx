import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { EventService } from '../lib/eventService'
import { ApprovalService } from '../lib/approvalService'
import { AnnouncementService } from '../lib/announcementService'

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    upcomingEvents: 0,
    announcements: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const userRole = user?.profile?.role || 'student'
  const userId = user?.id

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch stats based on user role
        const statsResult = await EventService.getEventStats(userId, userRole)
        
        let pendingApprovalsCount = 0
        if (['advisor', 'hod', 'principal'].includes(userRole)) {
          const approvalStats = await ApprovalService.getApprovalStats(userId, userRole)
          pendingApprovalsCount = approvalStats.data?.pending || 0
        }

        // Fetch announcements count
        const announcementsResult = await AnnouncementService.getAnnouncementsForRole(userRole)
        
        if (statsResult.data) {
          setStats({
            totalEvents: statsResult.data.totalEvents,
            pendingApprovals: pendingApprovalsCount,
            upcomingEvents: statsResult.data.approvedEvents,
            announcements: announcementsResult.data?.length || 0
          })
        }

        // Fetch recent activity (simplified for now)
        const recentEvents = await EventService.getEvents({ userRole })
        if (recentEvents.data) {
          const activities = recentEvents.data.slice(0, 4).map(event => ({
            id: event.id,
            type: 'event_created',
            message: `Event "${event.title}" was created`,
            time: new Date(event.created_at).toLocaleDateString()
          }))
          setRecentActivity(activities)
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Using demo data.')
        
        // Fallback to mock data if Supabase is not configured
        const mockStats = {
          student: { totalEvents: 15, pendingApprovals: 0, upcomingEvents: 5, announcements: 3 },
          lead: { totalEvents: 8, pendingApprovals: 2, upcomingEvents: 3, announcements: 3 },
          advisor: { totalEvents: 25, pendingApprovals: 5, upcomingEvents: 8, announcements: 3 },
          hod: { totalEvents: 35, pendingApprovals: 3, upcomingEvents: 12, announcements: 5 },
          principal: { totalEvents: 50, pendingApprovals: 2, upcomingEvents: 15, announcements: 8 }
        }
        
        setStats(mockStats[userRole] || mockStats.student)
        
        const mockActivities = [
          { id: 1, type: 'event_approved', message: 'Tech Symposium 2024 has been approved', time: '2 hours ago' },
          { id: 2, type: 'proposal_submitted', message: 'New proposal submitted', time: '4 hours ago' },
          { id: 3, type: 'announcement', message: 'New announcement posted', time: '1 day ago' },
          { id: 4, type: 'event_created', message: 'Cultural Fest 2024 event created', time: '2 days ago' },
        ]
        setRecentActivity(mockActivities.slice(0, userRole === 'student' ? 2 : 4))
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [userRole, userId])

  const getWelcomeMessage = () => {
    const messages = {
      student: 'View upcoming events and announcements',
      lead: 'Manage your event proposals and submissions',
      advisor: 'Review pending proposals and provide feedback',
      hod: 'Oversee departmental events and announcements',
      principal: 'Manage college-wide events and communications'
    }
    return messages[userRole] || messages.student
  }

  const getQuickActions = () => {
    const actions = {
      student: [
        { name: 'View Events', href: '/events', icon: CalendarIcon, color: 'bg-blue-500' },
        { name: 'Notice Board', href: '/notice-board', icon: DocumentTextIcon, color: 'bg-green-500' }
      ],
      lead: [
        { name: 'Create Event', href: '/events/create', icon: CalendarIcon, color: 'bg-blue-500' },
        { name: 'My Events', href: '/events', icon: ClockIcon, color: 'bg-orange-500' }
      ],
      advisor: [
        { name: 'Pending Approvals', href: '/approvals', icon: ClockIcon, color: 'bg-orange-500' },
        { name: 'All Events', href: '/events', icon: CalendarIcon, color: 'bg-blue-500' }
      ],
      hod: [
        { name: 'Approvals', href: '/approvals', icon: ClockIcon, color: 'bg-orange-500' },
        { name: 'Announcements', href: '/announcements', icon: DocumentTextIcon, color: 'bg-green-500' },
        { name: 'Events', href: '/events', icon: CalendarIcon, color: 'bg-blue-500' }
      ],
      principal: [
        { name: 'Final Approvals', href: '/approvals', icon: CheckCircleIcon, color: 'bg-green-500' },
        { name: 'Announcements', href: '/announcements', icon: DocumentTextIcon, color: 'bg-blue-500' },
        { name: 'All Events', href: '/events', icon: CalendarIcon, color: 'bg-purple-500' }
      ]
    }
    return actions[userRole] || actions.student
  }

  const getActivityIcon = (type) => {
    const icons = {
      event_approved: CheckCircleIcon,
      event_created: CalendarIcon,
      proposal_submitted: ClockIcon,
      announcement: DocumentTextIcon
    }
    return icons[type] || InformationCircleIcon
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.profile?.name || user?.email || 'User'}!
        </h1>
        <p className="text-gray-600">{getWelcomeMessage()}</p>
        {error && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        {userRole !== 'student' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.upcomingEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Announcements</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.announcements}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getQuickActions().map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.name}
                to={action.href}
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className={`flex-shrink-0 p-2 rounded-md ${action.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{action.name}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
