import { account, databases } from '../config/appwrite'
import { APPWRITE_CONFIG } from '../config/constants'
import { ID, Query } from 'appwrite'

/**
 * Check if user already has an active session
 */
const checkExistingSession = async () => {
  try {
    const user = await account.get()
    return user // Session exists
  } catch (error) {
    return null // No session
  }
}

/**
 * Admin Login
 */
export const adminLogin = async (email, password) => {
  try {
    // Check for existing session first
    const existingUser = await checkExistingSession()
    if (existingUser) {
      // If already logged in, verify admin role
      if (!existingUser.labels || !existingUser.labels.includes('admin')) {
        await account.deleteSession('current')
      } else {
        return { success: true, user: existingUser }
      }
    }

    // Create new session
    const session = await account.createEmailPasswordSession(email, password)
    const user = await account.get()
    
    // Verify admin role
    if (!user.labels || !user.labels.includes('admin')) {
      await account.deleteSession('current')
      throw new Error('Unauthorized: Not an admin user')
    }
    
    return { success: true, user }
  } catch (error) {
    console.error('Admin login error:', error)
    
    let errorMessage = error.message
    
    if (errorMessage.includes('Invalid credentials')) {
      errorMessage = 'Invalid email or password. Please try again.'
    } else if (errorMessage.includes('Unauthorized')) {
      errorMessage = 'You are not authorized as an admin.'
    }
    
    return { success: false, error: errorMessage || 'Login failed' }
  }
}

/**
 * College Login
 */
export const collegeLogin = async (email, password) => {
  try {
    // Check for existing session first
    const existingUser = await checkExistingSession()
    if (existingUser) {
      // Already logged in, fetch college data
      const collegeData = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        [Query.equal('email', email)]
      )
      
      if (collegeData.documents.length > 0) {
        return { success: true, user: existingUser, college: collegeData.documents[0] }
      } else {
        await account.deleteSession('current')
      }
    }

    // Create new session
    const session = await account.createEmailPasswordSession(email, password)
    const user = await account.get()
    
    // Fetch college data
    const collegeData = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.colleges,
      [Query.equal('email', email)]
    )
    
    if (collegeData.documents.length === 0) {
      await account.deleteSession('current')
      throw new Error('College not found. Please complete registration first.')
    }
    
    return { success: true, user, college: collegeData.documents[0] }
  } catch (error) {
    console.error('College login error:', error)
    
    let errorMessage = error.message
    
    if (errorMessage.includes('Invalid credentials')) {
      errorMessage = 'Invalid email or password. Please try again.'
    } else if (errorMessage.includes('College not found')) {
      errorMessage = 'College not registered. Please sign up first.'
    }
    
    return { success: false, error: errorMessage || 'Login failed' }
  }
}

/**
 * College Signup
 */
export const collegeSignup = async (data) => {
  try {
    // Check if already logged in
    const existingUser = await checkExistingSession()
    if (existingUser) {
      throw new Error('Please logout first before creating a new account')
    }

    // Create Appwrite account
    const user = await account.create(
      ID.unique(),
      data.email,
      data.password,
      data.collegeName
    )
    
    // Create college document in database
    const collegeDoc = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.colleges,
      ID.unique(),
      {
        collegeName: data.collegeName,
        collegeId: data.collegeId,
        email: data.email,
        phone: data.phone,
        address: data.address,
        userId: user.$id,
        scholarshipPercentage: 60,
        payNowEnabled: false,
      }
    )
    
    // Send verification email
    try {
      await account.createVerification(`${window.location.origin}/verify-otp`)
    } catch (verifyError) {
      console.warn('Email verification failed, but account created:', verifyError)
    }
    
    return { success: true, college: collegeDoc }
    
  } catch (error) {
    console.error('College signup error:', error)
    
    let errorMessage = error.message
    
    if (error.code === 409 || errorMessage.includes('user_already_exists')) {
      errorMessage = 'This email is already registered. Please login or use a different email.'
    } else if (errorMessage.includes('Invalid email')) {
      errorMessage = 'Please enter a valid email address.'
    } else if (errorMessage.includes('Password')) {
      errorMessage = 'Password must be at least 8 characters long.'
    } else if (errorMessage.includes('document_already_exists')) {
      errorMessage = 'College ID already exists. Please generate a new one.'
    } else if (errorMessage.includes('Unknown attribute')) {
      errorMessage = 'Database configuration error. Please check collection attributes.'
    } else if (errorMessage.includes('logout first')) {
      errorMessage = 'You are already logged in. Please logout first.'
    }
    
    return { success: false, error: errorMessage }
  }
}

/**
 * Student Login
 */
export const studentLogin = async (email, password) => {
  try {
    // Check for existing session first
    const existingUser = await checkExistingSession()
    if (existingUser) {
      // Already logged in, fetch student data
      const studentData = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.students,
        [Query.equal('email', email)]
      )
      
      if (studentData.documents.length > 0) {
        return { success: true, user: existingUser, student: studentData.documents[0] }
      } else {
        await account.deleteSession('current')
      }
    }

    // Create new session
    const session = await account.createEmailPasswordSession(email, password)
    const user = await account.get()
    
    // Fetch student data
    const studentData = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.students,
      [Query.equal('email', email)]
    )
    
    if (studentData.documents.length === 0) {
      await account.deleteSession('current')
      throw new Error('Student not found. Please contact your college to register.')
    }
    
    return { success: true, user, student: studentData.documents[0] }
  } catch (error) {
    console.error('Student login error:', error)
    
    let errorMessage = error.message
    
    if (errorMessage.includes('Invalid credentials')) {
      errorMessage = 'Invalid email or password. Please try again.'
    } else if (errorMessage.includes('Student not found')) {
      errorMessage = 'Student record not found. Contact your college admin.'
    }
    
    return { success: false, error: errorMessage || 'Login failed' }
  }
}

/**
 * Verify Email OTP
 */
export const verifyOTP = async (userId, secret) => {
  try {
    await account.updateVerification(userId, secret)
    return { success: true }
  } catch (error) {
    console.error('OTP verification error:', error)
    
    let errorMessage = error.message
    
    if (errorMessage.includes('Invalid token') || errorMessage.includes('expired')) {
      errorMessage = 'Invalid or expired OTP. Please request a new one.'
    }
    
    return { success: false, error: errorMessage || 'Verification failed' }
  }
}

/**
 * Send Password Recovery Email
 */
export const sendPasswordRecovery = async (email) => {
  try {
    await account.createRecovery(email, `${window.location.origin}/reset-password`)
    return { success: true }
  } catch (error) {
    console.error('Password recovery error:', error)
    
    let errorMessage = error.message
    
    if (errorMessage.includes('user_not_found')) {
      errorMessage = 'No account found with this email address.'
    }
    
    return { success: false, error: errorMessage || 'Failed to send recovery email' }
  }
}

/**
 * Logout
 */
export const logout = async () => {
  try {
    await account.deleteSession('current')
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: error.message || 'Logout failed' }
  }
}
