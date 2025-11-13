import { databases, functions } from '../config/appwrite'
import { APPWRITE_CONFIG, PAYMENT_STATUS } from '../config/constants'
import { ID, Query } from 'appwrite'
import axios from 'axios'

/**
 * Create Razorpay order
 */
export const createRazorpayOrder = async (amount, attemptId, studentData) => {
  try {
    // Call Appwrite Function to create Razorpay order
    const response = await functions.createExecution(
      'create-razorpay-order', // Function ID
      JSON.stringify({ amount, attemptId, studentData }),
      false
    )
    
    const result = JSON.parse(response.responseBody)
    return { success: true, order: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Verify Razorpay payment
 */
export const verifyPayment = async (paymentData) => {
  try {
    // Call Appwrite Function to verify payment signature
    const response = await functions.createExecution(
      'verify-razorpay-payment', // Function ID
      JSON.stringify(paymentData),
      false
    )
    
    const result = JSON.parse(response.responseBody)
    
    if (result.success) {
      // Update payment record in database
      await createPaymentRecord(paymentData)
      return { success: true }
    }
    
    return { success: false, error: 'Payment verification failed' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Create payment record in database
 */
export const createPaymentRecord = async (paymentData) => {
  try {
    const payment = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.payments,
      ID.unique(),
      {
        attemptId: paymentData.attemptId,
        studentId: paymentData.studentId,
        collegeId: paymentData.collegeId,
        studentName: paymentData.studentName,
        studentEmail: paymentData.studentEmail,
        studentPhone: paymentData.studentPhone,
        razorpayOrderId: paymentData.orderId,
        razorpayPaymentId: paymentData.paymentId,
        razorpaySignature: paymentData.signature,
        amount: paymentData.amount,
        paymentStatus: PAYMENT_STATUS.PAID,
        paidAt: new Date().toISOString(),
      }
    )
    
    // Update attempt with payment info
    await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.attempts,
      paymentData.attemptId,
      {
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentId: payment.$id,
      }
    )
    
    return { success: true, payment }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get payment by attempt ID
 */
export const getPaymentByAttempt = async (attemptId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.payments,
      [Query.equal('attemptId', attemptId)]
    )
    
    if (response.documents.length === 0) {
      return { success: false, error: 'Payment not found' }
    }
    
    return { success: true, payment: response.documents[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get all payments by college
 */
export const getPaymentsByCollege = async (collegeId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.payments,
      [Query.equal('collegeId', collegeId)]
    )
    return { success: true, payments: response.documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get all paid students
 */
export const getAllPaidStudents = async () => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.payments,
      [Query.equal('paymentStatus', PAYMENT_STATUS.PAID)]
    )
    return { success: true, payments: response.documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}