import { useState } from 'react'

const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('student')
  const [name, setName] = useState('')

  const roles = [
    { id: 'student', name: 'Student', description: 'View approved events and announcements' },
    { id: 'lead', name: 'Community Lead', description: 'Submit event proposals and track status' },
    { id: 'advisor', name: 'Staff Advisor', description: 'Review and approve event proposals' },
    { id: 'hod', name: 'Head of Department', description: 'Approve events and post announcements' },
    { id: 'principal', name: 'Principal', description: 'Final approval and college-wide management' }
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: `${name.toLowerCase().replace(/\s/g, '.')}@college.edu`,
      role: selectedRole
    }

    localStorage.setItem('mockUser', JSON.stringify(user))
    onLogin(user)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            🏫 Unified College Event Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-md" onSubmit={handleLogin}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role
            </label>
            <div className="space-y-3">
              {roles.map((role) => (
                <label key={role.id} className="flex items-start">
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={selectedRole === role.id}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> This is a demonstration interface. In production, this would integrate with Supabase authentication.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
