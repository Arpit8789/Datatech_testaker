import React from 'react'

const TestCard = ({ test, onStart }) => (
  <div className="card flex flex-col space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-lg font-bold">{test.testName}</span>
      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">{test.duration} min</span>
    </div>
    <span className="text-sm text-gray-500">Questions: {test.totalQuestions}</span>
    <button className="btn-primary mt-2 w-full" onClick={() => onStart(test)}>
      Start Test
    </button>
  </div>
)

export default TestCard
