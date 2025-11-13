import { createContext, useContext, useState, useEffect } from 'react'
import { account } from '../config/appwrite'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [collegeData, setCollegeData] = useState(null) // ✅ Store college data
  const [studentData, setStudentData] = useState(null) // ✅ Store student data

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
    setUser,
    collegeData,
    setCollegeData, // ✅ Expose setter
    studentData,
    setStudentData, // ✅ Expose setter
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
