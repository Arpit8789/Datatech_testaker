import React from 'react'

const CollegeDashboard = () => (
  <div className="container-custom">
    <h1 className="text-2xl font-bold mb-6">College Dashboard</h1>
    <div className="grid grid-cols-2 gap-6">
      <div className="card">Student Registration (Use StudentRegistrationForm component)</div>
      <div className="card">Stats (Use CollegeDashboardStats component)</div>
      <div className="card col-span-2">All Registered Students</div>
    </div>
  </div>
)

export default CollegeDashboard
