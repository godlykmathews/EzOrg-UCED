import { createContext, useContext, useEffect, useState } from 'react'
import { AuthService } from '../lib/auth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data } = await AuthService.getCurrentUser()
      setUser(data)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        
        if (session?.user) {
          // Get user profile
          const profile = await AuthService.getUserProfile(session.user.id)
          setUser({
            ...session.user,
            profile
          })
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData) => {
    setLoading(true)
    try {
      const result = await AuthService.signUp(email, password, userData)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      const result = await AuthService.signIn(email, password)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const result = await AuthService.signOut()
      setUser(null)
      setSession(null)
      return result
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    if (!user?.id) return { error: 'No user logged in' }
    
    const result = await AuthService.updateUserProfile(user.id, updates)
    if (result.data) {
      setUser(prev => ({
        ...prev,
        profile: { ...prev.profile, ...result.data }
      }))
    }
    return result
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
