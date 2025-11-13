import { createContext, useContext, useState, useEffect } from 'react'
import { account } from '../config/appwrite'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkUser = async () => {
    try {
      const currentUser = await account.get()
      setUser(currentUser)
      return currentUser
    } catch (error) {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  const value = {
    user,
    loading,
    checkUser,
    setUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
