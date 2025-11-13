import React from 'react'

const ScholarshipSettings = ({ college, onChange, onApply }) => (
  <div className="bg-white rounded-lg shadow p-6 mb-4">
    <h2 className="text-xl font-semibold text-primary-700 mb-4">Scholarship Settings</h2>
    <div className="flex items-center space-x-4">
      <label className="text-gray-700 font-medium">Percent Cutoff:</label>
      <input
        type="number"
        min={0}
        max={100}
        step={1}
        value={college.scholarshipPercentage || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input-field w-24 text-center font-bold"
      />
      <button className="btn-primary" onClick={onApply}>Apply</button>
    </div>
    <div className="mt-2 text-xs text-gray-500 max-w-md">
      Students scoring below cutoff will need to pay. Eligible students will skip payment.
    </div>
  </div>
)

export default ScholarshipSettings
