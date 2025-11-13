import { MARKS_CONFIG } from '../config/constants'

/**
 * Calculate total score from answers
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - Object with questionId as key and answer as value
 * @returns {Object} - Score details
 */
export const calculateScore = (questions, answers) => {
  let correctCount = 0
  let incorrectCount = 0
  let unattemptedCount = 0
  let totalMarks = 0

  questions.forEach((question) => {
    const userAnswer = answers[question.id]
    
    if (!userAnswer || userAnswer.length === 0) {
      unattemptedCount++
    } else {
      // Check if answer is correct
      const isCorrect = checkAnswer(question, userAnswer)
      
      if (isCorrect) {
        correctCount++
        totalMarks += MARKS_CONFIG.correctAnswer
      } else {
        incorrectCount++
        totalMarks += MARKS_CONFIG.incorrectAnswer
      }
    }
  })

  const totalQuestions = questions.length
  const percentage = totalQuestions > 0 ? (totalMarks / totalQuestions) * 100 : 0

  return {
    correctCount,
    incorrectCount,
    unattemptedCount,
    totalMarks,
    totalQuestions,
    percentage: percentage.toFixed(2),
  }
}

/**
 * Check if user's answer is correct
 */
const checkAnswer = (question, userAnswer) => {
  const correctAnswer = question.correctAnswer
  
  // For single choice questions
  if (typeof correctAnswer === 'string' || typeof correctAnswer === 'number') {
    return userAnswer === correctAnswer
  }
  
  // For multiple choice questions (array comparison)
  if (Array.isArray(correctAnswer)) {
    if (!Array.isArray(userAnswer)) return false
    
    if (correctAnswer.length !== userAnswer.length) return false
    
    const sortedCorrect = [...correctAnswer].sort()
    const sortedUser = [...userAnswer].sort()
    
    return sortedCorrect.every((ans, index) => ans === sortedUser[index])
  }
  
  return false
}

/**
 * Calculate percentage from marks
 */
export const calculatePercentage = (obtainedMarks, totalMarks) => {
  if (totalMarks === 0) return 0
  return ((obtainedMarks / totalMarks) * 100).toFixed(2)
}

/**
 * Check if score is above scholarship cutoff
 */
export const isEligibleForScholarship = (percentage, cutoff) => {
  return parseFloat(percentage) >= parseFloat(cutoff)
}