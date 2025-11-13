import React from 'react'

const CollegeDetails = ({ college, students, payments }) => (
  <div className="container-custom">
    <h2 className="text-xl font-semibold text-primary-700 mb-4">{college.collegeName} (ID: {college.collegeId})</h2>
    <div className="mb-4">Scholarship: {college.scholarshipPercentage}%</div>
    {/* Payments Table: Use StudentTable component */}
    <div className="mb-8">Student Table with Paid column</div>
    <div className="mb-8">Manage Groups (Use GroupManagement)</div>
    <div className="mb-8">Filter Paid/Unpaid students</div>
  </div>
)

export default CollegeDetails
