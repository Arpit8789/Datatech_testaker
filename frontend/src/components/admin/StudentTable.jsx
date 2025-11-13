import React from 'react'

const StudentTable = ({ students, onPayToggle, onAddToGroup }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto bg-white rounded-lg shadow border">
      <thead>
        <tr className="bg-primary-100">
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2">Test</th>
          <th className="px-4 py-2">Score</th>
          <th className="px-4 py-2">Scholarship</th>
          <th className="px-4 py-2">Paid</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.$id} className="hover:bg-gray-50">
            <td className="px-4 py-2">{student.name}</td>
            <td className="px-4 py-2">{student.email}</td>
            <td className="px-4 py-2 text-center">{student.phone}</td>
            <td className="px-4 py-2 text-center">{student.testSubmitted ? 'Yes' : 'No'}</td>
            <td className="px-4 py-2 text-center">{student.score !== undefined ? `${student.score}%` : '-'}</td>
            <td className="px-4 py-2 text-center">{student.scholarshipEligible ? 'Yes' : 'No'}</td>
            <td className="px-4 py-2 text-center">
              <span className={`px-2 py-1 rounded text-xs ${student.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {student.paid ? 'Yes' : 'No'}
              </span>
            </td>
            <td className="px-4 py-2">
              <button onClick={() => onPayToggle(student)} className={`btn-secondary text-xs px-3 py-1 mr-2 ${student.paid ? 'bg-green-100' : 'bg-red-100'}`}>{student.paid ? 'Mark Unpaid' : 'Mark Paid'}</button>
              <button onClick={() => onAddToGroup(student)} className="btn-primary text-xs px-3 py-1">Add to Group</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default StudentTable
