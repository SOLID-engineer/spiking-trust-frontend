import React, { useState } from 'react';

const Dropdown = ({ button, dropdown }) => {
  const [isShow, setIsShow] = useState(false);

  const toggleShow = () => {
    setIsShow((state) => !state);
  };

  return (
    <div className="relative">
      <div role="button" onClick={toggleShow} aria-hidden="true">
        {button}
      </div>
      {isShow && dropdown}
    </div>
  );
};

export default Dropdown;
