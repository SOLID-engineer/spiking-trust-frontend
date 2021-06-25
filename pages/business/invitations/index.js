import BusinessLayout from 'components/business-layout';
import withCompany from 'components/hocs/withCompany';
import React from 'react';

const Invitations = () => {
  return (
    <BusinessLayout pageTitle="Overview">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="font-semibold text-lg">Your performance in the last 28 days</h2>
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-semibold text-lg">Recently invited customers</h2>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default withCompany(Invitations);
