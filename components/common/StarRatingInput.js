import React, { useState } from 'react';

const StarRatingInput = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const renderStars = () => {
    const stars = [];
    const rating = hoverValue !== 0 ? hoverValue : value;
    let color = 'bg-red-500';
    if (rating >= 2) color = 'bg-yellow-300';
    if (rating >= 3) color = 'bg-yellow-500';
    if (rating >= 4) color = 'bg-green-500';
    if (rating === 5) color = 'bg-green-600';

    for (let i = 1; i <= 5; i += 1) {
      let percent = 0;
      if (i <= rating) percent = 100;
      stars.push(
        <button
          type="button"
          className="w-10 h-10 bg-gray-300 relative"
          onClick={() => onChange(i)}
          key={i}
          onMouseEnter={() => {
            setHoverValue(i);
          }}
        >
          <div
            className={`absolute top-0 bottom-0 left-0 ${color}`}
            style={{ width: `${percent}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-white p-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FFFFFF"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-star"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
        </button>
      );
    }
    return stars;
  };
  return (
    <div className="flex flex-row space-x-1" onMouseLeave={() => setHoverValue(0)}>
      {renderStars()}
    </div>
  );
};

export default StarRatingInput;
