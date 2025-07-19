import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  SpeakerWaveIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline'

const Layout = ({ children, user }) => {
  const { signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const userRole = user?.profile?.role || 'student'
  const userName = user?.profile?.name || user?.email || 'User'

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['student', 'lead', 'advisor', 'hod', 'principal'] },
    { name: 'Events', href: '/events', icon: CalendarIcon, roles: ['student', 'lead', 'advisor', 'hod', 'principal'] },
    { name: 'Create Event', href: '/events/create', icon: PlusCircleIcon, roles: ['lead'] },
    { name: 'Approvals', href: '/approvals', icon: ClipboardDocumentCheckIcon, roles: ['advisor', 'hod', 'principal'] },
    { name: 'Announcements', href: '/announcements', icon: SpeakerWaveIcon, roles: ['hod', 'principal'] },
    { name: 'Notice Board', href: '/notice-board', icon: ClipboardDocumentListIcon, roles: ['student', 'lead', 'advisor', 'hod', 'principal'] },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon, roles: ['student', 'lead', 'advisor', 'hod', 'principal'] },
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  )

  const getRoleColor = (role) => {
    const colors = {
      student: 'bg-green-100 text-green-800',
      lead: 'bg-blue-100 text-blue-800',
      advisor: 'bg-purple-100 text-purple-800',
      hod: 'bg-orange-100 text-orange-800',
      principal: 'bg-red-100 text-red-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">UCED</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="mt-5 px-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">🏫 UCED</h2>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(userRole)}`}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
              <span className="text-sm font-medium text-gray-700">{userName}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
