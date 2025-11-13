import React from 'react'

const TestManagement = ({ tests, onEdit, onDelete }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-primary-700 mb-2">All Tests</h2>
    <div className="grid md:grid-cols-2 gap-4">
      {tests.map((test) => (
        <div key={test.$id} className="card flex flex-col space-y-2">
          <span className="text-lg font-bold">{test.testName}</span>
          <span className="text-sm text-gray-600">Questions: {test.totalQuestions}</span>
          <span className="text-sm text-gray-400">Duration: {test.duration} mins</span>
          <div className="flex items-center space-x-2 mt-2">
            <button className="btn-primary" onClick={() => onEdit(test)}>Edit</button>
            <button className="btn-danger" onClick={() => onDelete(test)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default TestManagement
