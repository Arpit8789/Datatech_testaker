import { account, databases } from '../config/appwrite'
import { APPWRITE_CONFIG } from '../config/constants'
import { ID, Query } from 'appwrite'

/**
 * Admin Login
 */
export const adminLogin = async (email, password) => {
  try {
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
    return { success: false, error: error.message }
  }
}

/**
 * College Login
 */
export const collegeLogin = async (email, password) => {
  try {
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
      throw new Error('College not found')
    }
    
    return { success: true, user, college: collegeData.documents[0] }
  } catch (error) {
    console.error('College login error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * College Signup
 */
/**
 * College Signup
 */
export const collegeSignup = async (data) => {
  try {
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
        // ✅ No need for createdAt - Appwrite provides $createdAt automatically
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
      errorMessage = 'Email already registered. Please login or use a different email.'
    } else if (errorMessage.includes('Invalid email')) {
      errorMessage = 'Please enter a valid email address.'
    } else if (errorMessage.includes('Password')) {
      errorMessage = 'Password must be at least 8 characters long.'
    } else if (errorMessage.includes('Unknown attribute')) {
      errorMessage = 'Database configuration error. Please check collection attributes.'
    }
    
    return { success: false, error: errorMessage }
  }
}


/**
 * Student Login
 */
export const studentLogin = async (email, password) => {
  try {
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
      throw new Error('Student not found')
    }
    
    return { success: true, user, student: studentData.documents[0] }
  } catch (error) {
    console.error('Student login error:', error)
    return { success: false, error: error.message }
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
    return { success: false, error: error.message }
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
    return { success: false, error: error.message }
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
    return { success: false, error: error.message }
  }
}
