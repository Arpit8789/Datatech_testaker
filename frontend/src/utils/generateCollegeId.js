/**
 * Generate a unique 6-character college ID
 * Format: XXXXXX (alphanumeric)
 * Example: A7B9C2
 */
export const generateCollegeId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let collegeId = ''
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    collegeId += characters[randomIndex]
  }
  
  return collegeId
}

/**
 * Validate college ID format
 */
export const validateCollegeId = (collegeId) => {
  const regex = /^[A-Z0-9]{6}$/
  return regex.test(collegeId)
}