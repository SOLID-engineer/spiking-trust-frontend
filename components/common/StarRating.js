import React from 'react';

const StarRating = ({ value, size = 'lg' }) => {
  let classes = 'w-10 h-10';
  switch (size) {
    case 'lg':
      classes = 'w-10 h-10';
      break;
    case 'sm':
      classes = 'w-4 h-4';
      break;
    case 'md':
    default:
      classes = 'w-6 h-6 text-sm';
  }

  let color = 'bg-red-500';
  if (value >= 2) color = 'bg-yellow-300';
  if (value >= 3) color = 'bg-yellow-500';
  if (value >= 4) color = 'bg-green-500';
  if (value === 5) color = 'bg-green-600';

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i += 1) {
      let percent = 0;
      if (i <= value) percent = 100;
      else if (i > 1 && i - 1 < value) percent = (value - (i - 1)) * 100;
      stars.push(
        <div className={`bg-gray-300 relative ${classes}`} key={i}>
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
        </div>
      );
    }
    return stars;
  };
  return (
    <div className={`flex flex-row ${size === 'sm' ? 'space-x-0.5' : 'space-x-1'}`}>
      {renderStars()}
    </div>
  );
};

export default React.memo(StarRating);
