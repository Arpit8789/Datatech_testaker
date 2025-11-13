import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
// Auth Pages
import AdminLogin from './pages/auth/AdminLogin'
import CollegeLogin from './pages/auth/CollegeLogin'
import CollegeSignup from './pages/auth/CollegeSignup'
import StudentLogin from './pages/auth/StudentLogin'
import OTPVerification from './pages/auth/OTPVerification'
import ForgotPassword from './pages/auth/ForgotPassword'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import CollegeDetails from './pages/admin/CollegeDetails'
import AllTests from './pages/admin/AllTests'
import EditTest from './pages/admin/EditTest'
import AllMarks from './pages/admin/AllMarks'
import ScholarshipManagement from './pages/admin/ScholarshipManagement'
import PaymentManagement from './pages/admin/PaymentManagement'
import GroupsManagement from './pages/admin/GroupsManagement'

// College Pages
import CollegeDashboard from './pages/college/CollegeDashboard'
import RegisterStudent from './pages/college/RegisterStudent'
import ViewStudents from './pages/college/ViewStudents'

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import AvailableTests from './pages/student/AvailableTests'
import TakeTest from './pages/student/TakeTest'
import TestResult from './pages/student/TestResult'
import PaymentPage from './pages/student/PaymentPage'
import PaymentSuccess from './pages/student/PaymentSuccess'

// Components
import ProtectedRoute from './components/common/ProtectedRoute'
import Loader from './components/common/Loader'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/" element={<Navigate to="/admin/login" replace />} /> */}
      
      {/* Auth Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/college/login" element={<CollegeLogin />} />
      <Route path="/college/signup" element={<CollegeSignup />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/college/:collegeId"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CollegeDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tests"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AllTests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tests/edit/:testId"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <EditTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/marks"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AllMarks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scholarship"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ScholarshipManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PaymentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/groups"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <GroupsManagement />
          </ProtectedRoute>
        }
      />

      {/* College Routes */}
      <Route
        path="/college/dashboard"
        element={
          <ProtectedRoute allowedRoles={['college']}>
            <CollegeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/college/register-student"
        element={
          <ProtectedRoute allowedRoles={['college']}>
            <RegisterStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/college/students"
        element={
          <ProtectedRoute allowedRoles={['college']}>
            <ViewStudents />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tests"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <AvailableTests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/test/:testId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TakeTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/result/:attemptId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TestResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/payment/:attemptId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/payment/success"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App