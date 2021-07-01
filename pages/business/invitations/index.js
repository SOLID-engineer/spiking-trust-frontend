import BusinessLayout from 'components/business-layout';
import RecentInvitations from 'components/business/invitations/RecentInvitations';
import withCompany from 'components/hocs/withCompany';
import React from 'react';

const Invitations = () => {
  return (
    <BusinessLayout pageTitle="Overview">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-2">Your performance in the last 28 days</h2>
          <div className="bg-white p-4 grid grid-cols-3 gap-4">
            <div>
              <div className="font-semibold text-2xl">6</div>
              <div className="text-gray-400">Invitations delivered</div>
            </div>
            <div>
              <div className="font-semibold text-2xl">0</div>
              <div className="text-gray-400">Verified reviews</div>
            </div>
            <div>
              <div className="font-semibold text-2xl">6</div>
              <div className="text-gray-400">Average rating</div>
            </div>
          </div>
        </div>
        <RecentInvitations />
      </div>
    </BusinessLayout>
  );
};

export default withCompany(Invitations);
