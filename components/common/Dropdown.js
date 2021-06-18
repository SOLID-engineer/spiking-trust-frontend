import React, { useState } from 'react';

const Dropdown = ({ button, dropdown }) => {
  const [isShow, setIsShow] = useState(false);

  const toggleShow = () => {
    setIsShow((state) => !state);
  };

  return (
    <div className="relative">
      <button type="button" onClick={toggleShow}>
        {button}
      </button>
      {isShow && dropdown}
    </div>
  );
};

export default Dropdown;
