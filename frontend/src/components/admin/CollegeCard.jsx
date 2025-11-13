import React from 'react'

const CollegeCard = ({ college, onClick }) => (
  <div className="card cursor-pointer transition-transform hover:scale-105" onClick={onClick}>
    <div className="flex flex-col space-y-2">
      <span className="text-xl font-semibold text-primary-700">{college.collegeName}</span>
      <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded">ID: {college.collegeId}</span>
      <span className="text-sm text-gray-600">Email: {college.email}</span>
      <span className="text-sm text-gray-500">Students: {college.studentCount || 0}</span>
      <span className="text-sm text-primary-500">Scholarship: {college.scholarshipPercentage || 0}%</span>
    </div>
  </div>
)

export default CollegeCard
