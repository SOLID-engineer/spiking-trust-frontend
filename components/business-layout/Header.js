import React from 'react';

const Header = ({ pageTitle, headerBottom = null }) => (
  <div className="bg-white shadow-sm">
    <div className="h-14 flex flex-row justify-between items-center w-full px-6">
      <h1 className="font-semibold text-lg">{pageTitle}</h1>
      <ul className="flex flex-row items-center space-x-2">
        <li>
          <a>User</a>
        </li>
      </ul>
    </div>
    {headerBottom}
  </div>
);

export default Header;
