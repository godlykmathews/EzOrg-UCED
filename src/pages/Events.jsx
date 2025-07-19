import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

const Events = ({ user }) => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock events data
    const mockEvents = [
      {
        id: 1,
        title: 'Tech Symposium 2024',
        description: 'Annual technology symposium featuring latest innovations and research presentations.',
        date: '2024-03-15',
        venue: 'Main Auditorium',
        status: 'approved',
        submittedBy: 'Tech Club Lead',
        submittedById: '1'
      },
      {
        id: 2,
        title: 'Cultural Fest 2024',
        description: 'Three-day cultural festival with music, dance, and drama competitions.',
        date: '2024-03-20',
        venue: 'College Ground',
        status: 'pending_hod',
        submittedBy: 'Cultural Committee',
        submittedById: '2'
      },
      {
        id: 3,
        title: 'Career Fair',
        description: 'Job fair with leading companies for final year students.',
        date: '2024-03-25',
        venue: 'Conference Hall',
        status: 'pending_principal',
        submittedBy: 'Placement Cell',
        submittedById: '3'
      },
      {
        id: 4,
        title: 'Science Exhibition',
        description: 'Student science projects and research showcase.',
        date: '2024-03-30',
        venue: 'Science Block',
        status: 'approved',
        submittedBy: 'Science Club',
        submittedById: '4'
      },
      {
        id: 5,
        title: 'Sports Day',
        description: 'Annual sports competition with various athletic events.',
        date: '2024-04-05',
        venue: 'Sports Complex',
        status: 'pending_staff_advisor',
        submittedBy: 'Sports Committee',
        submittedById: '5'
      }
    ]

    // Filter events based on user role
    let filteredByRole = mockEvents
    if (user.role === 'student') {
      filteredByRole = mockEvents.filter(event => event.status === 'approved')
    } else if (user.role === 'lead') {
      // Show all events but highlight user's submissions
      filteredByRole = mockEvents
    }

    setEvents(filteredByRole)
    setFilteredEvents(filteredByRole)
  }, [user.role])

  useEffect(() => {
    let filtered = events

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(event => event.status === filter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
  }, [events, filter, searchTerm])

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      pending_staff_advisor: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Staff Advisor' },
      pending_hod: { color: 'bg-orange-100 text-orange-800', text: 'Pending HoD' },
      pending_principal: { color: 'bg-blue-100 text-blue-800', text: 'Pending Principal' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    }

    const config = statusConfig[status] || statusConfig.approved
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filterOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending_staff_advisor', label: 'Pending Staff Advisor' },
    { value: 'pending_hod', label: 'Pending HoD' },
    { value: 'pending_principal', label: 'Pending Principal' }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-gray-600">
            {user.role === 'student' 
              ? 'View approved college events'
              : 'Manage and track event proposals'
            }
          </p>
        </div>
        {user.role === 'lead' && (
          <Link
            to="/events/create"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Events
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, or venue..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {user.role !== 'student' && (
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                {getStatusBadge(event.status)}
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {event.submittedBy}
                </div>
              </div>
              
              <Link
                to={`/events/${event.id}`}
                className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'There are no events to display at the moment.'
            }
          </p>
          {user.role === 'lead' && (
            <div className="mt-6">
              <Link
                to="/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create First Event
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Events
