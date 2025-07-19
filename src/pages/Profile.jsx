import { useState } from 'react'
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: '+91-9876543210',
    department: 'Computer Science',
    designation: user.role === 'student' ? 'Final Year Student' :
                  user.role === 'lead' ? 'Community Lead - Tech Club' :
                  user.role === 'advisor' ? 'Assistant Professor' :
                  user.role === 'hod' ? 'Head of Department' :
                  'Principal',
    address: '123 College Street, City Name',
    bio: user.role === 'student' ? 'Enthusiastic computer science student passionate about technology and innovation.' :
         user.role === 'lead' ? 'Dedicated community leader focused on organizing impactful tech events.' :
         user.role === 'advisor' ? 'Experienced educator committed to guiding students and supporting event initiatives.' :
         user.role === 'hod' ? 'Departmental leader with expertise in academic administration and student development.' :
         'Educational leader committed to fostering excellence in higher education.'
  })

  const handleSave = () => {
    // In a real application, this would update the user data in Supabase
    console.log('Updated profile data:', formData)
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: '+91-9876543210',
      department: 'Computer Science',
      designation: user.role === 'student' ? 'Final Year Student' :
                    user.role === 'lead' ? 'Community Lead - Tech Club' :
                    user.role === 'advisor' ? 'Assistant Professor' :
                    user.role === 'hod' ? 'Head of Department' :
                    'Principal',
      address: '123 College Street, City Name',
      bio: user.role === 'student' ? 'Enthusiastic computer science student passionate about technology and innovation.' :
           user.role === 'lead' ? 'Dedicated community leader focused on organizing impactful tech events.' :
           user.role === 'advisor' ? 'Experienced educator committed to guiding students and supporting event initiatives.' :
           user.role === 'hod' ? 'Departmental leader with expertise in academic administration and student development.' :
           'Educational leader committed to fostering excellence in higher education.'
    })
    setIsEditing(false)
  }

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
    // Mock activity statistics based on user role
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
    return stats[user.role] || stats.student
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                <UserCircleIcon className="h-16 w-16 text-gray-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
              <p className="text-gray-600">{formData.designation}</p>
              
              <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {formData.email}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {formData.phone}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                  {formData.department}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Statistics</h3>
            <div className="space-y-4">
              {getActivityStats().map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <span className="text-lg font-semibold text-blue-600">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.designation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.address}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive email updates about events and announcements</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-500">Receive SMS alerts for urgent announcements</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Event Reminders</h4>
                  <p className="text-sm text-gray-500">Get reminders about upcoming events</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
