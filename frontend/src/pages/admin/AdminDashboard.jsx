import React from 'react'

const AdminDashboard = () => (
  <div className="container-custom">
    <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
    {/* College List, Payment stats, and Test Management can be routed here */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card">Colleges List (Use CollegeCard component)</div>
      <div className="card">Test Management (Use TestManagement)</div>
      <div className="card">Payment Overview</div>
    </div>
  </div>
)

export default AdminDashboard
