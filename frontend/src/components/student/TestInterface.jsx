import React, { useState } from 'react'

const TestInterface = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const next = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1)
  }
  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }
  const finish = () => {
    onFinish && onFinish(answers)
  }

  const q = questions[currentIndex]

  return (
    <div className="card max-w-2xl mx-auto my-6">
      <h2 className="text-lg font-semibold text-primary-700 mb-2">Question {currentIndex + 1} of {questions.length}</h2>
      <div className="mb-4">
        <p className="font-medium mb-2">{q.question}</p>
        {q.options.map((opt, idx) => (
          <label key={idx} className="block mb-1">
            <input
              type="radio"
              name={`q_${q.id}`}
              checked={answers[q.id] === idx}
              onChange={() => handleAnswer(q.id, idx)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button onClick={prev} disabled={currentIndex === 0} className="btn-secondary">Previous</button>
        <button onClick={next} disabled={currentIndex === questions.length - 1} className="btn-secondary">Next</button>
        <button onClick={finish} className="btn-primary">Submit Test</button>
      </div>
    </div>
  )
}

export default TestInterface
