import { useState, useEffect } from 'react'
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { AuthService } from '../lib/auth'

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    address: '',
    bio: ''
  })

  // Load user profile data
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || '',
        email: user.profile.email || '',
        phone: user.profile.phone || '',
        department: user.profile.department || '',
        designation: user.profile.designation || getDefaultDesignation(user.profile.role),
        address: user.profile.address || '',
        bio: user.profile.bio || getDefaultBio(user.profile.role)
      })
    }
  }, [user])

  const getDefaultDesignation = (role) => {
    const designations = {
      student: 'Student',
      lead: 'Community Lead',
      advisor: 'Assistant Professor',
      hod: 'Head of Department',
      principal: 'Principal'
    }
    return designations[role] || 'User'
  }

  const getDefaultBio = (role) => {
    const bios = {
      student: 'Enthusiastic student passionate about technology and innovation.',
      lead: 'Dedicated community leader focused on organizing impactful events.',
      advisor: 'Experienced educator committed to guiding students and supporting initiatives.',
      hod: 'Departmental leader with expertise in academic administration and development.',
      principal: 'Educational leader committed to fostering excellence in higher education.'
    }
    return bios[role] || 'Member of the college community.'
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Update user profile in Supabase
      const { data, error: updateError } = await AuthService.updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        address: formData.address,
        bio: formData.bio,
        updated_at: new Date().toISOString()
      })

      if (updateError) throw updateError

      setIsEditing(false)
      setSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

      // Update the user context with new data
      if (data) {
        // This would typically update the user context
        console.log('Profile updated successfully:', data)
      }

    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (user?.profile) {
      setFormData({
        name: user.profile.name || '',
        email: user.profile.email || '',
        phone: user.profile.phone || '',
        department: user.profile.department || '',
        designation: user.profile.designation || getDefaultDesignation(user.profile.role),
        address: user.profile.address || '',
        bio: user.profile.bio || getDefaultBio(user.profile.role)
      })
    }
    setIsEditing(false)
    setError(null)
  }

  const getRoleColor = (role) => {
    const colors = {
      student: 'bg-emerald-100 text-emerald-800',
      lead: 'bg-blue-100 text-blue-800',
      advisor: 'bg-purple-100 text-purple-800',
      hod: 'bg-amber-100 text-amber-800',
      principal: 'bg-red-100 text-red-800'
    }
    return colors[role] || 'bg-slate-100 text-slate-800'
  }

  const getRoleDisplayName = (role) => {
    const names = {
      student: 'Student',
      lead: 'Community Lead',
      advisor: 'Staff Advisor',
      hod: 'Head of Department',
      principal: 'Principal'
    }
    return names[role] || role
  }

  const getActivityStats = () => {
    // These would come from actual Supabase queries in a real implementation
    const stats = {
      student: [
        { label: 'Events Attended', value: '12' },
        { label: 'Certificates Earned', value: '5' },
        { label: 'Workshops Completed', value: '8' }
      ],
      lead: [
        { label: 'Events Organized', value: '6' },
        { label: 'Proposals Submitted', value: '8' },
        { label: 'Events Approved', value: '5' }
      ],
      advisor: [
        { label: 'Events Reviewed', value: '25' },
        { label: 'Events Approved', value: '22' },
        { label: 'Students Mentored', value: '45' }
      ],
      hod: [
        { label: 'Department Events', value: '18' },
        { label: 'Approvals Given', value: '32' },
        { label: 'Announcements Made', value: '15' }
      ],
      principal: [
        { label: 'College Events', value: '45' },
        { label: 'Final Approvals', value: '42' },
        { label: 'Policies Implemented', value: '8' }
      ]
    }
    return stats[user?.profile?.role] || stats.student
  }

  if (!user || !user.profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">Profile not found</h3>
          <p className="mt-1 text-sm text-slate-500">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-slate-600">Manage your personal information and preferences</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Profile updated successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                <UserCircleIcon className="h-16 w-16 text-slate-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-slate-900">{formData.name}</h2>
              <p className="text-slate-600">{formData.designation}</p>
              
              <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.profile.role)}`}>
                  {getRoleDisplayName(user.profile.role)}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center text-sm text-slate-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {formData.email}
                </div>
                {formData.phone && (
                  <div className="flex items-center justify-center text-sm text-slate-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {formData.phone}
                  </div>
                )}
                {formData.department && (
                  <div className="flex items-center justify-center text-sm text-slate-600">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    {formData.department}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6 mt-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Activity Statistics</h3>
            <div className="space-y-4">
              {getActivityStats().map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{stat.label}</span>
                  <span className="text-lg font-semibold text-blue-600">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-slate-900">Personal Information</h3>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                ) : (
                  <p className="text-slate-900">{formData.name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <p className="text-slate-900">{formData.email}</p>
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed here</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91-XXXXXXXXXX"
                  />
                ) : (
                  <p className="text-slate-900">{formData.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Computer Science"
                  />
                ) : (
                  <p className="text-slate-900">{formData.department || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Designation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{formData.designation || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your address"
                  />
                ) : (
                  <p className="text-slate-900">{formData.address || 'Not provided'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-slate-900">{formData.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6 mt-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
                  <p className="text-sm text-slate-500">Receive email updates about events and announcements</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Event Reminders</h4>
                  <p className="text-sm text-slate-500">Get reminders about upcoming events</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Approval Notifications</h4>
                  <p className="text-sm text-slate-500">Receive notifications when your submissions are reviewed</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
