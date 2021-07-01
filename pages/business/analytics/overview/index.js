import BusinessLayout from 'components/business-layout';
import withCompany from 'components/hocs/withCompany';
import React from 'react';

const Overview = () => {
  return (
    <BusinessLayout pageTitle="Overview">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="font-semibold text-lg mb-4">Your performance in the last 28 days</h2>
        <div className="bg-white mb-4 p-4">7</div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4">
            <h3 className="font-semibold text-lg mb-4">Distribution of stars</h3>
          </div>
          <div className="bg-white p-4">
            <h3 className="font-semibold text-lg mb-4">Source of reviews</h3>
          </div>
        </div>
        <h2 className="font-semibold text-lg mb-4">
          How you’ve replied to negative reviews in the past 12 months
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4">
            <h3 className="font-semibold text-lg mb-4">Reply rate (public)</h3>
          </div>
          <div className="bg-white p-4">
            <h3 className="font-semibold text-lg mb-4">Time to reply (public)</h3>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default withCompany(Overview);
