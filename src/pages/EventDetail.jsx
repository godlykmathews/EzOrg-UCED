import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

const EventDetail = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [approvals, setApprovals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock event data
    const mockEvent = {
      id: parseInt(id),
      title: 'Tech Symposium 2024',
      description: 'Annual technology symposium featuring latest innovations and research presentations. This event will showcase cutting-edge research from students and faculty, featuring keynote speakers from leading tech companies and academic institutions.',
      date: '2024-03-15',
      startTime: '09:00',
      endTime: '17:00',
      venue: 'Main Auditorium',
      status: 'pending_hod',
      submittedBy: 'Tech Club Lead',
      submittedById: '1',
      category: 'Technical',
      expectedAttendees: 200,
      budget: 50000,
      requirements: 'Projector, Sound system, Microphones, Chairs for 200 people',
      contactPerson: 'John Doe',
      contactEmail: 'john.doe@college.edu',
      contactPhone: '+91-9876543210',
      submittedAt: '2024-02-15T10:30:00Z'
    }

    const mockApprovals = [
      {
        id: 1,
        role: 'advisor',
        reviewedBy: 'Dr. Smith',
        status: 'approved',
        comment: 'Excellent proposal. The agenda looks comprehensive and well-planned.',
        reviewedAt: '2024-02-16T14:20:00Z'
      },
      {
        id: 2,
        role: 'hod',
        reviewedBy: null,
        status: 'pending',
        comment: null,
        reviewedAt: null
      },
      {
        id: 3,
        role: 'principal',
        reviewedBy: null,
        status: 'pending',
        comment: null,
        reviewedAt: null
      }
    ]

    setEvent(mockEvent)
    setApprovals(mockApprovals)
    setLoading(false)
  }, [id])

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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getApprovalStatus = (approval) => {
    if (approval.status === 'approved') {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircleIcon className="h-5 w-5 mr-1" />
          Approved
        </div>
      )
    } else if (approval.status === 'rejected') {
      return (
        <div className="flex items-center text-red-600">
          <XCircleIcon className="h-5 w-5 mr-1" />
          Rejected
        </div>
      )
    } else {
      return (
        <div className="flex items-center text-yellow-600">
          <ClockIcon className="h-5 w-5 mr-1" />
          Pending
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Event not found</h3>
          <p className="mt-1 text-gray-500">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Events
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="mt-1 text-gray-600">Submitted by {event.submittedBy}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            {getStatusBadge(event.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">{formatDate(event.date)}</p>
                  <p className="text-sm">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">{event.venue}</p>
                  <p className="text-sm">Event venue</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <UserGroupIcon className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">{event.expectedAttendees} people</p>
                  <p className="text-sm">Expected attendees</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <CurrencyDollarIcon className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">₹{event.budget?.toLocaleString()}</p>
                  <p className="text-sm">Estimated budget</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>
            
            {event.requirements && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Special Requirements</h3>
                <p className="text-gray-600">{event.requirements}</p>
              </div>
            )}
          </div>

          {/* Approval Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Approval Timeline</h2>
            
            <div className="space-y-4">
              {approvals.map((approval, index) => (
                <div key={approval.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      approval.status === 'approved' ? 'bg-green-100' :
                      approval.status === 'rejected' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {approval.status === 'approved' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : approval.status === 'rejected' ? (
                        <XCircleIcon className="h-5 w-5 text-red-600" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {approval.role === 'advisor' ? 'Staff Advisor' :
                         approval.role === 'hod' ? 'Head of Department' :
                         approval.role === 'principal' ? 'Principal' : approval.role}
                      </h3>
                      {getApprovalStatus(approval)}
                    </div>
                    
                    {approval.reviewedBy && (
                      <p className="text-sm text-gray-500">Reviewed by {approval.reviewedBy}</p>
                    )}
                    
                    {approval.comment && (
                      <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {approval.comment}
                      </p>
                    )}
                    
                    {approval.reviewedAt && (
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDateTime(approval.reviewedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">{event.contactPerson}</p>
                <p className="text-sm text-gray-500">Event Coordinator</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">{event.contactEmail}</p>
                <p className="text-sm text-gray-600">{event.contactPhone}</p>
              </div>
            </div>
          </div>

          {/* Event Meta */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Event Information</h2>
            
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="text-sm text-gray-900">{event.category}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Submitted</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(event.submittedAt)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Event ID</dt>
                <dd className="text-sm text-gray-900">#{event.id}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          {(user.role === 'advisor' || user.role === 'hod' || user.role === 'principal') && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Approve Event
                </button>
                
                <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
                  Request Revision
                </button>
                
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Reject Event
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetail
