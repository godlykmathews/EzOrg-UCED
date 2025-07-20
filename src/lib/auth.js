import { supabase, TABLES, USER_ROLES } from './supabase'

export class AuthService {
  // Sign up a new user
  static async signUp(email, password, userData) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase
          .from(TABLES.USERS)
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              name: userData.name,
              role: userData.role,
              phone: userData.phone || null,
              department: userData.department || null,
              designation: userData.designation || null,
              created_at: new Date().toISOString()
            }
          ])

        if (profileError) throw profileError
      }

      return { data: authData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in user
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Fetch user profile
      if (data.user) {
        const userProfile = await this.getUserProfile(data.user.id)
        return { data: { ...data, profile: userProfile }, error: null }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      if (user) {
        const profile = await this.getUserProfile(user.id)
        return { data: { ...user, profile }, error: null }
      }
      
      return { data: null, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get user profile from users table
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Update user profile
  static async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Check if user has specific role
  static hasRole(user, role) {
    return user?.profile?.role === role
  }

  // Check if user can access admin features
  static canAccessAdmin(user) {
    const adminRoles = [USER_ROLES.ADVISOR, USER_ROLES.HOD, USER_ROLES.PRINCIPAL]
    return adminRoles.includes(user?.profile?.role)
  }

  // Get auth state change subscription
  static onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
