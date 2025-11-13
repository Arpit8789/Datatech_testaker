import { useState, useRef, useEffect } from 'react'

/**
 * Custom hook for camera access and management
 */
export const useCamera = () => {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      setIsCameraOn(true)
      setHasPermission(true)
      setError(null)
    } catch (err) {
      console.error('Camera access error:', err)
      setError(err.message)
      setHasPermission(false)
      setIsCameraOn(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsCameraOn(false)
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopCamera()
    }
  }, [])

  return {
    isCameraOn,
    hasPermission,
    error,
    videoRef,
    startCamera,
    stopCamera,
  }
}