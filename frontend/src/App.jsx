import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

// Pages
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/college/login" element={<CollegeLogin />} />
          <Route path="/college/signup" element={<CollegeSignup />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/colleges/:id" element={<CollegeDetails />} />
          <Route path="/admin/tests" element={<AllTests />} />
          <Route path="/admin/tests/:id/edit" element={<EditTest />} />
          <Route path="/admin/marks" element={<AllMarks />} />
          <Route path="/admin/scholarships" element={<ScholarshipManagement />} />
          <Route path="/admin/payments" element={<PaymentManagement />} />
          <Route path="/admin/groups" element={<GroupsManagement />} />
          
          {/* College Routes */}
          <Route path="/college/dashboard" element={<CollegeDashboard />} />
          <Route path="/college/register-student" element={<RegisterStudent />} />
          <Route path="/college/students" element={<ViewStudents />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/tests" element={<AvailableTests />} />
          <Route path="/student/test/:id" element={<TakeTest />} />
          <Route path="/student/result/:id" element={<TestResult />} />
          <Route path="/student/payment/:attemptId" element={<PaymentPage />} />
          <Route path="/student/payment-success" element={<PaymentSuccess />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
