import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from './Loader'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return <Loader fullScreen />
  }

  if (!user) {
    // Redirect to appropriate login page
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/admin/login" replace />
    }
    if (allowedRoles.includes('college')) {
      return <Navigate to="/college/login" replace />
    }
    if (allowedRoles.includes('student')) {
      return <Navigate to="/student/login" replace />
    }
    return <Navigate to="/" replace />
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to their appropriate dashboard
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />
      case 'college':
        return <Navigate to="/college/dashboard" replace />
      case 'student':
        return <Navigate to="/student/dashboard" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute