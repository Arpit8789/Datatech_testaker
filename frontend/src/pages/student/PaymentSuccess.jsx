import React from 'react'

const PaymentSuccess = ({ payment }) => (
  <div className="container-custom">
    <h2 className="text-xl font-semibold mb-4 text-green-700">Payment Successful</h2>
    <div className="card max-w-md mx-auto">
      <p className="mb-2">Thank you for your payment.</p>
      <p className="mb-2">Order ID: {payment ? payment.razorpayOrderId : 'N/A'}</p>
      <p className="mb-2">Payment ID: {payment ? payment.razorpayPaymentId : 'N/A'}</p>
      <p className="mb-4">Your test will be unlocked or results shown.</p>
    </div>
  </div>
)

export default PaymentSuccess
