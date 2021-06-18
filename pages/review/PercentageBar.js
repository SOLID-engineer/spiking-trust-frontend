import React from 'react';

const PercentageBar = ({ barColor, activePercentage, active = false }) => (
  <div className="bg-gray-200 rounded-sm flex-grow w-full h-5">
    <div
      className="rounded-sm  h-full"
      style={{
        backgroundColor: active ? barColor : '#6f6f87',
        width: `${activePercentage * 100}% `,
      }}
    />
  </div>
);

export default PercentageBar;
