import { format, formatDistanceToNow, parseISO } from 'date-fns'

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'PPP')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatStr)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return 'Invalid Date'
  }
}

/**
 * Format timestamp to date and time
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'PPP p')
}

/**
 * Format date to short format (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (date) => {
  return formatDate(date, 'MMM dd, yyyy')
}

/**
 * Format time only
 */
export const formatTime = (date) => {
  return formatDate(date, 'p')
}