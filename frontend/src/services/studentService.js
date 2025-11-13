import { databases, account } from '../config/appwrite'
import { APPWRITE_CONFIG } from '../config/constants'
import { ID, Query } from 'appwrite'

/**
 * Register a new student
 */
export const registerStudent = async (studentData) => {
  try {
    // Create Appwrite account
    const user = await account.create(
      ID.unique(),
      studentData.email,
      studentData.password,
      studentData.name
    )
    
    // Create student document
    const student = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.students,
      ID.unique(),
      {
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        collegeId: studentData.collegeId,
        userId: user.$id,
        payNowEnabled: false,
        createdAt: new Date().toISOString(),
      }
    )
    
    // Send verification email
    await account.createVerification(`${window.location.origin}/verify-otp`)
    
    return { success: true, student }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get student by ID
 */
export const getStudentById = async (studentId) => {
  try {
    const response = await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.students,
      studentId
    )
    return { success: true, student: response }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get student by email
 */
export const getStudentByEmail = async (email) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.students,
      [Query.equal('email', email)]
    )
    
    if (response.documents.length === 0) {
      return { success: false, error: 'Student not found' }
    }
    
    return { success: true, student: response.documents[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get all students
 */
export const getAllStudents = async () => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.students
    )
    return { success: true, students: response.documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Update student's Pay Now setting
 */
export const toggleStudentPayNow = async (studentDocId, enabled) => {
  try {
    const response = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.students,
      studentDocId,
      { payNowEnabled: enabled }
    )
    return { success: true, student: response }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get students by college ID
 */
export const getStudentsByCollegeId = async (collegeId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.students,
      [Query.equal('collegeId', collegeId)]
    )
    return { success: true, students: response.documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}