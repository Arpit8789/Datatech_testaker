import React from 'react'

const PaymentPage = ({ attempt, onPay }) => (
  <div className="container-custom">
    <h2 className="text-xl font-semibold mb-4">Payment Required</h2>
    <div className="card max-w-md mx-auto">
      <p className="mb-2">You have not qualified for scholarship on this attempt.</p>
      <p className="mb-4">Please pay the required amount to continue.</p>
      <button className="btn-primary" onClick={onPay}>Pay Now</button>
    </div>
  </div>
)

export default PaymentPage
