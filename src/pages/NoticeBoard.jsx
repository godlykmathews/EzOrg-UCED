import { useState, useEffect } from 'react'
import {
  ClipboardDocumentListIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const NoticeBoard = ({ user }) => {
  const [notices, setNotices] = useState([])
  const [filteredNotices, setFilteredNotices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    // Mock notices data
    const mockNotices = [
      {
        id: 1,
        title: 'Mid-Semester Exam Schedule Released',
        content: 'The mid-semester examination schedule has been released. Please check your respective department notice boards for detailed timing and venue information. Students are advised to prepare accordingly.',
        category: 'academic',
        priority: 'high',
        postedBy: 'Academic Office',
        postedAt: '2024-02-20T10:00:00Z',
        expiresAt: '2024-03-15T23:59:59Z',
        targetAudience: 'students'
      },
      {
        id: 2,
        title: 'Library Hours Extended During Exams',
        content: 'Starting next week, the library will remain open until 10 PM on weekdays to accommodate student study needs during exam preparation. Weekend hours will also be extended from 8 AM to 8 PM.',
        category: 'facilities',
        priority: 'normal',
        postedBy: 'Library Administration',
        postedAt: '2024-02-19T14:30:00Z',
        expiresAt: '2024-04-01T23:59:59Z',
        targetAudience: 'all'
      },
      {
        id: 3,
        title: 'Annual Cultural Festival - Registration Open',
        content: 'Registration for the Annual Cultural Festival is now open. Students can participate in various events including music, dance, drama, and art competitions. Last date for registration is March 1st.',
        category: 'events',
        priority: 'normal',
        postedBy: 'Cultural Committee',
        postedAt: '2024-02-18T09:15:00Z',
        expiresAt: '2024-03-01T23:59:59Z',
        targetAudience: 'students'
      },
      {
        id: 4,
        title: 'Faculty Development Program',
        content: 'A three-day faculty development program on "Modern Teaching Methodologies" will be conducted from March 5-7. All faculty members are encouraged to participate.',
        category: 'training',
        priority: 'normal',
        postedBy: 'HR Department',
        postedAt: '2024-02-17T11:20:00Z',
        expiresAt: '2024-03-07T23:59:59Z',
        targetAudience: 'faculty'
      },
      {
        id: 5,
        title: 'Hostel Fee Payment Deadline',
        content: 'Students residing in hostels are reminded that the fee payment deadline for the current semester is February 28th. Late payment will incur additional charges.',
        category: 'administrative',
        priority: 'high',
        postedBy: 'Hostel Administration',
        postedAt: '2024-02-16T16:45:00Z',
        expiresAt: '2024-02-28T23:59:59Z',
        targetAudience: 'students'
      },
      {
        id: 6,
        title: 'Campus Wi-Fi Maintenance',
        content: 'Campus Wi-Fi will undergo maintenance on February 25th from 2 AM to 6 AM. Internet services may be intermittent during this period.',
        category: 'technical',
        priority: 'normal',
        postedBy: 'IT Department',
        postedAt: '2024-02-15T10:30:00Z',
        expiresAt: '2024-02-26T23:59:59Z',
        targetAudience: 'all'
      }
    ]

    // Filter notices based on user role
    let filteredByRole = mockNotices
    if (user.role === 'student') {
      filteredByRole = mockNotices.filter(notice => 
        notice.targetAudience === 'all' || notice.targetAudience === 'students'
      )
    } else if (user.role === 'lead') {
      filteredByRole = mockNotices.filter(notice => 
        notice.targetAudience === 'all' || notice.targetAudience === 'students'
      )
    } else {
      // Faculty, HoD, Principal can see all notices
      filteredByRole = mockNotices
    }

    // Filter out expired notices for students
    if (user.role === 'student' || user.role === 'lead') {
      const now = new Date()
      filteredByRole = filteredByRole.filter(notice => new Date(notice.expiresAt) > now)
    }

    setNotices(filteredByRole)
    setFilteredNotices(filteredByRole)
  }, [user.role])

  useEffect(() => {
    let filtered = notices

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(notice => notice.category === categoryFilter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.postedBy.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredNotices(filtered)
  }, [notices, categoryFilter, searchTerm])

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      normal: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    )
  }

  const getCategoryBadge = (category) => {
    const colors = {
      academic: 'bg-purple-100 text-purple-800',
      events: 'bg-green-100 text-green-800',
      facilities: 'bg-orange-100 text-orange-800',
      training: 'bg-blue-100 text-blue-800',
      administrative: 'bg-yellow-100 text-yellow-800',
      technical: 'bg-red-100 text-red-800'
    }
    
    const labels = {
      academic: 'Academic',
      events: 'Events',
      facilities: 'Facilities',
      training: 'Training',
      administrative: 'Administrative',
      technical: 'Technical'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category]}`}>
        {labels[category]}
      </span>
    )
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpiringSoon = (expiresAt) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffInDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
    return diffInDays <= 3 && diffInDays > 0
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'academic', label: 'Academic' },
    { value: 'events', label: 'Events' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'training', label: 'Training' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'technical', label: 'Technical' }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
        <p className="mt-1 text-gray-600">
          {user.role === 'student' || user.role === 'lead' 
            ? 'Stay updated with college notices and announcements'
            : 'College notices and announcements dashboard'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Notices
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, content, or author..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'There are no notices to display at the moment.'
              }
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div 
              key={notice.id} 
              className={`bg-white rounded-lg shadow p-6 ${
                isExpiringSoon(notice.expiresAt) ? 'border-l-4 border-yellow-400' : ''
              } ${
                notice.priority === 'high' ? 'border-l-4 border-red-400' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                    {getPriorityBadge(notice.priority)}
                    {getCategoryBadge(notice.category)}
                    {isExpiringSoon(notice.expiresAt) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Expires Soon
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{notice.content}</p>
                  
                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {notice.postedBy}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Posted: {formatDateTime(notice.postedAt)}
                    </div>
                    {notice.expiresAt && (
                      <div className="flex items-center">
                        <TagIcon className="h-4 w-4 mr-1" />
                        Expires: {formatDate(notice.expiresAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {filteredNotices.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-gray-900">{filteredNotices.length}</p>
              <p className="text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'all' ? 'Filtered' : 'Total'} Notices
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-red-600">
                {filteredNotices.filter(n => n.priority === 'high').length}
              </p>
              <p className="text-sm text-gray-500">High Priority</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-yellow-600">
                {filteredNotices.filter(n => isExpiringSoon(n.expiresAt)).length}
              </p>
              <p className="text-sm text-gray-500">Expiring Soon</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoticeBoard
