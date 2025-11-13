import { createContext, useContext, useState, useEffect } from 'react'
import { account } from '../config/appwrite'
import { USER_ROLES } from '../config/constants'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await account.get()
      setUser(currentUser)
      
      // Determine user role from labels
      if (currentUser.labels && currentUser.labels.length > 0) {
        const role = currentUser.labels[0]
        setUserRole(role)
      }
    } catch (error) {
      // User not logged in
      setUser(null)
      setUserRole(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password)
      await checkUser()
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession('current')
      setUser(null)
      setUserRole(null)
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  }

  const register = async (email, password, name) => {
    try {
      await account.create('unique()', email, password, name)
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  const updateUserData = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }))
  }

  const value = {
    user,
    userRole,
    loading,
    login,
    logout,
    register,
    checkUser,
    updateUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}