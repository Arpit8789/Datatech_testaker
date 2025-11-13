import React, { useRef, useEffect } from 'react'

const ProctoringCamera = ({ show = true }) => {
  const videoRef = useRef(null)
  useEffect(() => {
    if (show && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream
        })
        .catch(() => {/* silently ignore */})
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [show])

  if (!show) return null
  return (
    <div className="flex flex-col items-center my-4">
      <span className="text-xs text-primary-700 mb-2">Your camera is on for proctoring</span>
      <video ref={videoRef} autoPlay playsInline muted width="200" height="150" className="rounded shadow" />
    </div>
  )
}

export default ProctoringCamera
