import React from 'react';
import { useSelector } from 'react-redux';

import BusinessSelector from 'slices/business/selector';
import BusinessLayout from 'components/business-layout';

const Information = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  return (
    <BusinessLayout pageTitle="Settings">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white p-4">
          <h3 className="font-semibold text-lg mb-4 border-b pb-4">
            Profile Settings: <span className="text-gray-500">{currentCompany.domain}</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <a className="block hover:bg-gray-100 p-2">
              <div className="font-semibold">Profile Page</div>
              <div className="text-gray-500">Edit your public details.</div>
            </a>
            <a className="block hover:bg-gray-100 p-2">
              <div className="font-semibold">Categories</div>
              <div className="text-gray-500">Add or change your business categories.</div>
            </a>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default Information;