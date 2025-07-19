import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    upcomingEvents: 0,
    announcements: 0
  })

  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // Mock data based on user role
    const mockStats = {
      student: { totalEvents: 15, pendingApprovals: 0, upcomingEvents: 5, announcements: 3 },
      lead: { totalEvents: 8, pendingApprovals: 2, upcomingEvents: 3, announcements: 3 },
      advisor: { totalEvents: 25, pendingApprovals: 5, upcomingEvents: 8, announcements: 3 },
      hod: { totalEvents: 35, pendingApprovals: 3, upcomingEvents: 12, announcements: 5 },
      principal: { totalEvents: 50, pendingApprovals: 2, upcomingEvents: 15, announcements: 8 }
    }

    setStats(mockStats[user.role] || mockStats.student)

    // Mock recent activity
    const activities = [
      { id: 1, type: 'event_approved', message: 'Tech Symposium 2024 has been approved', time: '2 hours ago' },
      { id: 2, type: 'proposal_submitted', message: 'New proposal submitted by John Doe', time: '4 hours ago' },
      { id: 3, type: 'announcement', message: 'New announcement posted', time: '1 day ago' },
      { id: 4, type: 'event_created', message: 'Cultural Fest 2024 event created', time: '2 days ago' },
    ]

    setRecentActivity(activities.slice(0, user.role === 'student' ? 2 : 4))
  }, [user.role])

  const getWelcomeMessage = () => {
    const messages = {
      student: 'View upcoming events and announcements',
      lead: 'Manage your event proposals and submissions',
      advisor: 'Review pending proposals and provide feedback',
      hod: 'Oversee departmental events and announcements',
      principal: 'Manage college-wide events and communications'
    }
    return messages[user.role] || messages.student
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
    return actions[user.role] || actions.student
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">{getWelcomeMessage()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
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

        {user.role !== 'student' && (
          <div className="bg-white rounded-lg shadow p-6">
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

        <div className="bg-white rounded-lg shadow p-6">
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

        <div className="bg-white rounded-lg shadow p-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {getQuickActions().map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    to={action.href}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`flex-shrink-0 ${action.color} p-2 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{action.name}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
