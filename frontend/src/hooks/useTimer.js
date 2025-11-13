import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for countdown timer
 * @param {number} initialTime - Initial time in seconds
 * @param {function} onComplete - Callback when timer reaches 0
 */
export const useTimer = (initialTime, onComplete) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            if (onComplete) onComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, onComplete])

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = (newTime) => {
    setTimeLeft(newTime || initialTime)
    setIsRunning(false)
  }

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return {
    timeLeft,
    isRunning,
    formatTime,
    start,
    pause,
    reset,
  }
}