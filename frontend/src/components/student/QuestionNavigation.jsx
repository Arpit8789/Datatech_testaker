import React from 'react'

const QuestionNavigation = ({ total, currentIndex, onNavigate }) => (
  <div className="flex space-x-2 justify-center my-4">
    {[...Array(total).keys()].map((idx) => (
      <button
        key={idx}
        className={`rounded-full w-8 h-8 flex items-center justify-center border ${idx === currentIndex ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        onClick={() => onNavigate(idx)}
      >
        {idx + 1}
      </button>
    ))}
  </div>
)

export default QuestionNavigation
