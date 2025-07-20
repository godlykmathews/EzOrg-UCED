import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

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
    item.roles.includes(user.role)
  )

  const getRoleColor = (role) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      lead: 'bg-green-100 text-green-800',
      advisor: 'bg-yellow-100 text-yellow-800',
      hod: 'bg-purple-100 text-purple-800',
      principal: 'bg-red-100 text-red-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

<<<<<<< Updated upstream
=======
  const handleLogout = async () => {
    await signOut()
  }

>>>>>>> Stashed changes
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h2 className="text-2xl font-bold text-white">EzOrg</h2>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        location.pathname === item.href
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-4 flex-shrink-0 h-6 w-6" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
          <div className="flex-shrink-0 w-14"></div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-slate-800 pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-2xl font-bold text-white">EzOrg</h2>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 flex-shrink-0 h-6 w-6" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
<<<<<<< Updated upstream
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
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <button
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
=======
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-slate-50">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
>>>>>>> Stashed changes
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
