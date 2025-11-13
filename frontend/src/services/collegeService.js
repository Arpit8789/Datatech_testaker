import { databases } from '../config/appwrite'
import { APPWRITE_CONFIG } from '../config/constants'
import { ID, Query } from 'appwrite'
import { generateCollegeId } from '../utils/generateCollegeId'

/**
 * Get all colleges
 */
export const getAllColleges = async () => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.colleges
    )
    return { success: true, colleges: response.documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get college by ID
 */
export const getCollegeById = async (collegeId) => {
  try {
    const response = await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.colleges,
      collegeId
    )
    return { success: true, college: response }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Update college scholarship settings
 */
export const updateScholarshipSettings = async (collegeDocId, scholarshipPercentage) => {
  try {
    const response = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.colleges,
      collegeDocId,
      { scholarshipPercentage }
    )
    return { success: true, college: response }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Enable/Disable Pay Now for entire college
 */
export const toggleCollegePayNow = async (collegeDocId, enabled) => {
  try {
    const response = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.colleges,
      collegeDocId,
      { payNowEnabled: enabled }
    )
    return { success: true, college: response }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get students by college
 */
export const getStudentsByCollege = async (collegeId) => {
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

/**
 * Check if college ID is unique
 */
export const isCollegeIdUnique = async (collegeId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.colleges,
      [Query.equal('collegeId', collegeId)]
    )
    return response.documents.length === 0
  } catch (error) {
    return false
  }
}

/**
 * Generate unique college ID
 */
export const generateUniqueCollegeId = async () => {
  let attempts = 0
  const maxAttempts = 10
  
  while (attempts < maxAttempts) {
    const collegeId = generateCollegeId()
    const isUnique = await isCollegeIdUnique(collegeId)
    
    if (isUnique) {
      return collegeId
    }
    
    attempts++
  }
  
  throw new Error('Failed to generate unique college ID')
}