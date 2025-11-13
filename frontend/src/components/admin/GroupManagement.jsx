import React from 'react'

const GroupManagement = ({ groups, students, onAddToGroup, onRemoveFromGroup }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-primary-700 mb-2">Student Groups (Boxes)</h2>
    <div className="grid md:grid-cols-2 gap-4">
      {groups.map((group) => (
        <div key={group.$id} className="card flex flex-col space-y-2">
          <span className="text-lg font-bold">{group.name}</span>
          <span className="text-sm text-gray-600">Members: {group.students.length}</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {group.students.map((studentId) => {
              const student = students.find(s => s.$id === studentId)
              if (!student) return null
              return (
                <span key={student.$id} className="bg-primary-50 px-2 py-1 text-xs rounded text-primary-600">
                  {student.name}
                  <button onClick={() => onRemoveFromGroup(group, student)} className="ml-2 text-red-600 text-xs">Remove</button>
                </span>
              )
            })}
          </div>
          <button className="btn-primary mt-2" onClick={() => onAddToGroup(group)}>Add Students</button>
        </div>
      ))}
    </div>
  </div>
)

export default GroupManagement
