import React from 'react'

const ResultCard = ({ result }) => (
  <div className="card max-w-md mx-auto my-8">
    <h2 className="text-xl font-semibold text-center text-primary-700 mb-4">Test Result</h2>
    <div className="flex flex-col gap-2">
      <span className="font-medium">Score: <span className="text-lg text-primary-600">{result.score}</span></span>
      <span>Correct: {result.correctCount}</span>
      <span>Incorrect: {result.incorrectCount}</span>
      <span>Unattempted: {result.unattemptedCount}</span>
      <span>Percentage: <b>{result.percentage}%</b></span>
      <span>Test Ended At: {result.completedAt}</span>
      {result.scholarshipEligible !== undefined && (
        <span className={result.scholarshipEligible ? 'text-green-600' : 'text-red-600'}>
          {result.scholarshipEligible ? 'Scholarship Eligible' : 'Not Eligible for Scholarship'}
        </span>
      )}
    </div>
  </div>
)

export default ResultCard
