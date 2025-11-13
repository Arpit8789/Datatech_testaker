import React from 'react'

const CollegeDashboardStats = ({ stats }) => (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div className="card">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-primary-700">Students</span>
        <span className="text-2xl font-bold text-primary-900 mt-1">{stats.students}</span>
      </div>
    </div>
    <div className="card">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-green-700">Tests Taken</span>
        <span className="text-2xl font-bold text-green-900 mt-1">{stats.testsTaken}</span>
      </div>
    </div>
    <div className="card col-span-2">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-blue-800">Scholarship Eligible</span>
        <span className="text-2xl font-bold text-blue-900 mt-1">{stats.scholarshipEligible}</span>
      </div>
    </div>
  </div>
)

export default CollegeDashboardStats
