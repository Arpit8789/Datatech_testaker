// Appwrite Configuration
export const APPWRITE_CONFIG = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  collections: {
    colleges: import.meta.env.VITE_APPWRITE_COLLECTIONS_COLLEGES,
    students: import.meta.env.VITE_APPWRITE_COLLECTIONS_STUDENTS,
    tests: import.meta.env.VITE_APPWRITE_COLLECTIONS_TESTS,
    attempts: import.meta.env.VITE_APPWRITE_COLLECTIONS_ATTEMPTS,
    payments: import.meta.env.VITE_APPWRITE_COLLECTIONS_PAYMENTS,
    groups: import.meta.env.VITE_APPWRITE_COLLECTIONS_GROUPS,
    generalSettings: import.meta.env.VITE_APPWRITE_COLLECTION_GENERAL_SETTINGS
  },
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
}

// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  COLLEGE: 'college',
  STUDENT: 'student',
}

// Test Configuration
export const TEST_CONFIG = {
  totalTests: 6,
  testNames: [
    'Test 1: General Aptitude',
    'Test 2: Logical Reasoning',
    'Test 3: Technical Knowledge',
    'Test 4: Quantitative Aptitude',
    'Test 5: Verbal Ability',
    'Test 6: Domain Knowledge',
  ],
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
}

// Scholarship Cutoff (default)
export const DEFAULT_SCHOLARSHIP_CUTOFF = 60 // 60%

// Test Attempt Status
export const ATTEMPT_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
}

// College ID Configuration
export const COLLEGE_ID_CONFIG = {
  prefix: 'DTI',
  length: 6, // Total length including prefix
  format: 'ALPHANUMERIC', // Characters + Numbers
}

// App Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Datatech Test Platform',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
}

// API Endpoints (for potential future use)
export const API_ENDPOINTS = {
  paymentVerification: '/payment/verify',
  emailNotification: '/email/send',
}

// Time Configuration (in minutes)
export const TIME_CONFIG = {
  testDuration: 60, // 60 minutes per test
  warningTime: 5, // Show warning at 5 minutes remaining
}

// Question Types
export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_CHOICE: 'multiple_choice',
}

// Marks Configuration
export const MARKS_CONFIG = {
  correctAnswer: 1,
  incorrectAnswer: 0,
  unattempted: 0,
}