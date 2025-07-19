import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline'

const Approvals = ({ user }) => {
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [reviewedApprovals, setReviewedApprovals] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [comment, setComment] = useState('')
  const [actionType, setActionType] = useState('')

  useEffect(() => {
    // Mock data based on user role
    const mockPendingApprovals = [
      {
        id: 1,
        title: 'Tech Symposium 2024',
        description: 'Annual technology symposium featuring latest innovations',
        date: '2024-03-15',
        venue: 'Main Auditorium',
        submittedBy: 'Tech Club Lead',
        submittedAt: '2024-02-15T10:30:00Z',
        category: 'Technical',
        expectedAttendees: 200,
        budget: 50000,
        currentStage: user.role === 'advisor' ? 'pending_staff_advisor' : 
                     user.role === 'hod' ? 'pending_hod' : 'pending_principal',
        urgency: 'normal'
      },
      {
        id: 2,
        title: 'Cultural Fest 2024',
        description: 'Three-day cultural festival with various competitions',
        date: '2024-03-20',
        venue: 'College Ground',
        submittedBy: 'Cultural Committee',
        submittedAt: '2024-02-16T14:20:00Z',
        category: 'Cultural',
        expectedAttendees: 500,
        budget: 100000,
        currentStage: user.role === 'advisor' ? 'pending_staff_advisor' : 
                     user.role === 'hod' ? 'pending_hod' : 'pending_principal',
        urgency: 'high'
      }
    ]

    const mockReviewedApprovals = [
      {
        id: 3,
        title: 'Science Exhibition',
        description: 'Student science projects showcase',
        date: '2024-03-30',
        venue: 'Science Block',
        submittedBy: 'Science Club',
        submittedAt: '2024-02-10T09:15:00Z',
        reviewedAt: '2024-02-12T16:30:00Z',
        category: 'Academic',
        expectedAttendees: 150,
        budget: 25000,
        status: 'approved',
        comment: 'Great initiative. Approved with full budget allocation.'
      },
      {
        id: 4,
        title: 'Debate Competition',
        description: 'Inter-department debate competition',
        date: '2024-04-10',
        venue: 'Seminar Hall',
        submittedBy: 'Literary Club',
        submittedAt: '2024-02-08T11:45:00Z',
        reviewedAt: '2024-02-09T10:20:00Z',
        category: 'Academic',
        expectedAttendees: 100,
        budget: 15000,
        status: 'revision_requested',
        comment: 'Please provide more details about the judging criteria and prizes.'
      }
    ]

    setPendingApprovals(mockPendingApprovals)
    setReviewedApprovals(mockReviewedApprovals)
  }, [user.role])

  const handleApprovalAction = async (eventId, action, comment) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Approval action:', { eventId, action, comment, reviewedBy: user.name })
      
      // Move event from pending to reviewed
      const eventToMove = pendingApprovals.find(event => event.id === eventId)
      if (eventToMove) {
        const updatedEvent = {
          ...eventToMove,
          status: action,
          comment: comment,
          reviewedAt: new Date().toISOString()
        }
        
        setPendingApprovals(prev => prev.filter(event => event.id !== eventId))
        setReviewedApprovals(prev => [updatedEvent, ...prev])
      }
      
      // Close modal
      setSelectedEvent(null)
      setComment('')
      setActionType('')
      
      alert(`Event ${action} successfully!`)
    } catch (error) {
      console.error('Error processing approval:', error)
      alert('Failed to process approval. Please try again.')
    }
  }

  const getUrgencyBadge = (urgency) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      normal: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[urgency]}`}>
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Priority
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved', icon: CheckCircleIcon },
      revision_requested: { color: 'bg-yellow-100 text-yellow-800', text: 'Revision Requested', icon: ClockIcon },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected', icon: XCircleIcon }
    }

    const config = statusConfig[status] || statusConfig.approved
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (!['advisor', 'hod', 'principal'].includes(user.role)) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">You don't have permission to access approvals.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Event Approvals</h1>
        <p className="mt-1 text-gray-600">
          Review and approve event proposals as {user.role === 'advisor' ? 'Staff Advisor' : 
          user.role === 'hod' ? 'Head of Department' : 'Principal'}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending ({pendingApprovals.length})
            </button>
            <button
              onClick={() => setActiveTab('reviewed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviewed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviewed ({reviewedApprovals.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Pending Approvals */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
              <p className="mt-1 text-sm text-gray-500">All event proposals have been reviewed.</p>
            </div>
          ) : (
            pendingApprovals.map((event) => (
              <div key={event.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      {getUrgencyBadge(event.urgency)}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Submitted: {formatDateTime(event.submittedAt)}</span>
                      <span>Budget: ₹{event.budget?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/events/${event.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                  
                  <button
                    onClick={() => {
                      setSelectedEvent(event)
                      setActionType('approved')
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedEvent(event)
                      setActionType('revision_requested')
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                  >
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Request Revision
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedEvent(event)
                      setActionType('rejected')
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reviewed Approvals */}
      {activeTab === 'reviewed' && (
        <div className="space-y-4">
          {reviewedApprovals.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviewed approvals</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't reviewed any event proposals yet.</p>
            </div>
          ) : (
            reviewedApprovals.map((event) => (
              <div key={event.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      {getStatusBadge(event.status)}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    
                    {event.comment && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-start">
                          <ChatBubbleLeftEllipsisIcon className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-700">{event.comment}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Reviewed on {formatDateTime(event.reviewedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Submitted: {formatDateTime(event.submittedAt)}</span>
                      <span>Budget: ₹{event.budget?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    to={`/events/${event.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Approval Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {actionType === 'approved' ? 'Approve Event' :
                 actionType === 'revision_requested' ? 'Request Revision' : 'Reject Event'}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Event: <strong>{selectedEvent.title}</strong>
              </p>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  {actionType === 'approved' ? 'Approval Comment (Optional)' :
                   actionType === 'revision_requested' ? 'What needs to be revised?' : 'Reason for Rejection'}
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    actionType === 'approved' ? 'Add any comments or conditions...' :
                    actionType === 'revision_requested' ? 'Specify what changes are needed...' : 
                    'Explain why this event is being rejected...'
                  }
                  required={actionType !== 'approved'}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedEvent(null)
                    setComment('')
                    setActionType('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprovalAction(selectedEvent.id, actionType, comment)}
                  disabled={actionType !== 'approved' && !comment.trim()}
                  className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                    actionType === 'approved' ? 'bg-green-600 hover:bg-green-700' :
                    actionType === 'revision_requested' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Confirm {actionType === 'approved' ? 'Approval' :
                          actionType === 'revision_requested' ? 'Revision Request' : 'Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Approvals
