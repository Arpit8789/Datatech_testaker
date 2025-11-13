import { databases, storage } from '../config/appwrite'
import { APPWRITE_CONFIG } from '../config/constants'
import { ID, Query } from 'appwrite'

/**
 * Get all tests
 */
export const getAllTests = async () => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.tests
    )
    return { success: true, tests: response.documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get test by ID
 */
export const getTestById = async (testId) => {
  try {
    const response = await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.tests,
      testId
    )
    return { success: true, test: response }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get test questions from storage
 */
export const getTestQuestions = async (fileId) => {
  try {
    const fileUrl = storage.getFileView(APPWRITE_CONFIG.bucketId, fileId)
    const response = await fetch(fileUrl)
    const questions = await response.json()
    return { success: true, questions }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Update test questions (admin only)
 */
export const updateTestQuestions = async (fileId, updatedQuestions) => {
  try {
    // Convert questions to JSON string
    const jsonData = JSON.stringify(updatedQuestions, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const file = new File([blob], 'questions.json', { type: 'application/json' })
    
    // Delete old file and upload new one
    await storage.deleteFile(APPWRITE_CONFIG.bucketId, fileId)
    const newFile = await storage.createFile(
      APPWRITE_CONFIG.bucketId,
      fileId,
      file
    )
    
    return { success: true, fileId: newFile.$id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Create a new test
 */
export const createTest = async (testData, questionsFile) => {
  try {
    // Upload questions file to storage
    const file = await storage.createFile(
      APPWRITE_CONFIG.bucketId,
      ID.unique(),
      questionsFile
    )
    
    // Create test document
    const test = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.tests,
      ID.unique(),
      {
        testName: testData.testName,
        testNumber: testData.testNumber,
        duration: testData.duration || 60,
        totalQuestions: testData.totalQuestions,
        questionsFileId: file.$id,
        createdAt: new Date().toISOString(),
      }
    )
    
    return { success: true, test }
  } catch (error) {
    return { success: false, error: error.message }
  }
}