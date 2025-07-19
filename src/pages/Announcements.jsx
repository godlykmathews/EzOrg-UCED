import { useState, useEffect } from 'react'
import {
  SpeakerWaveIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

const Announcements = ({ user }) => {
  const [announcements, setAnnouncements] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    targetAudience: 'all'
  })

  useEffect(() => {
    // Mock announcements data
    const mockAnnouncements = [
      {
        id: 1,
        title: 'Mid-Semester Exam Schedule Released',
        content: 'The mid-semester examination schedule has been released. Please check your respective department notice boards for detailed timing and venue information.',
        priority: 'high',
        targetAudience: 'all',
        createdBy: 'Academic Office',
        createdAt: '2024-02-20T10:00:00Z',
        createdById: '1'
      },
      {
        id: 2,
        title: 'Library Hours Extended',
        content: 'Starting next week, the library will remain open until 10 PM on weekdays to accommodate student study needs during exam preparation.',
        priority: 'normal',
        targetAudience: 'students',
        createdBy: 'Librarian',
        createdAt: '2024-02-19T14:30:00Z',
        createdById: '2'
      },
      {
        id: 3,
        title: 'Faculty Meeting - Monthly Review',
        content: 'All faculty members are requested to attend the monthly review meeting scheduled for tomorrow at 3 PM in the conference hall.',
        priority: 'high',
        targetAudience: 'faculty',
        createdBy: 'Principal Office',
        createdAt: '2024-02-18T09:15:00Z',
        createdById: '3'
      }
    ]

    setAnnouncements(mockAnnouncements)
  }, [])

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const newAnnouncement = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdBy: user.name,
        createdById: user.id,
        createdAt: new Date().toISOString()
      }

      setAnnouncements(prev => [newAnnouncement, ...prev])
      setIsCreateModalOpen(false)
      setFormData({ title: '', content: '', priority: 'normal', targetAudience: 'all' })
      
      alert('Announcement created successfully!')
    } catch (error) {
      console.error('Error creating announcement:', error)
      alert('Failed to create announcement. Please try again.')
    }
  }

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id))
      alert('Announcement deleted successfully!')
    }
  }

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      normal: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    )
  }

  const getAudienceBadge = (audience) => {
    const colors = {
      all: 'bg-purple-100 text-purple-800',
      students: 'bg-green-100 text-green-800',
      faculty: 'bg-orange-100 text-orange-800',
      staff: 'bg-blue-100 text-blue-800'
    }
    
    const labels = {
      all: 'All',
      students: 'Students',
      faculty: 'Faculty',
      staff: 'Staff'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[audience]}`}>
        {labels[audience]}
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

  if (!['hod', 'principal'].includes(user.role)) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">You don't have permission to manage announcements.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-1 text-gray-600">Create and manage college announcements</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <SpeakerWaveIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first announcement.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create First Announcement
              </button>
            </div>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                    {getPriorityBadge(announcement.priority)}
                    {getAudienceBadge(announcement.targetAudience)}
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{announcement.content}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {announcement.createdBy}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDateTime(announcement.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      // Edit functionality would go here
                      alert('Edit functionality would be implemented here')
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Announcement</h3>
              
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter announcement content"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                    Target Audience
                  </label>
                  <select
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="students">Students</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false)
                      setFormData({ title: '', content: '', priority: 'normal', targetAudience: 'all' })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Announcements
