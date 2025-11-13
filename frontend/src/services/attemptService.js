import { databases } from '../config/appwrite'
import { APPWRITE_CONFIG, ATTEMPT_STATUS } from '../config/constants'
import { ID, Query } from 'appwrite'
import { calculateScore } from '../utils/scoreCalculator'

/**
 * Create a new test attempt
 */
export const createAttempt = async (attemptData) => {
  try {
    const attempt = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.attempts,
      ID.unique(),
      {
        studentId: attemptData.studentId,
        testId: attemptData.testId,
        collegeId: attemptData.collegeId,
        status: ATTEMPT_STATUS.IN_PROGRESS,
        startedAt: new Date().toISOString(),
        answers: {},
      }
    )
    return { success: true, attempt }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Update test attempt with answers
 */
export const updateAttemptAnswers = async (attemptId, answers) => {
  try {
    const response = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.attempts,
      attemptId,
      { answers: JSON.stringify(answers) }
    )
    return { success: true, attempt: response }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Submit test attempt with final score
 */
export const submitAttempt = async (attemptId, questions, answers) => {
  try {
    // Calculate score
    const scoreData = calculateScore(questions, answers)
    
    // Update attempt with final data
    const response = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.attempts,
      attemptId,
      {
        status: ATTEMPT_STATUS.COMPLETED,
        answers: JSON.stringify(answers),
        score: scoreData.totalMarks,
        percentage: parseFloat(scoreData.percentage),
        correctCount: scoreData.correctCount,
        incorrectCount: scoreData.incorrectCount,
        unattemptedCount: scoreData.unattemptedCount,
        completedAt: new Date().toISOString(),
      }
    )
    
    return { success: true, attempt: response, scoreData }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get attempt by ID
 */
export const getAttemptById = async (attemptId) => {
  try {
    const response = await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.attempts,
      attemptId
    )
    return { success: true, attempt: response }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get attempts by student ID
 */
export const getAttemptsByStudent = async (studentId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.attempts,
      [Query.equal('studentId', studentId)]
    )
    return { success: true, attempts: response.documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get all attempts (admin)
 */
export const getAllAttempts = async () => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.attempts
    )
    return { success: true, attempts: response.documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get attempts by college ID
 */
export const getAttemptsByCollege = async (collegeId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.attempts,
      [Query.equal('collegeId', collegeId)]
    )
    return { success: true, attempts: response.documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}