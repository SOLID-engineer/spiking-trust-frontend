import BusinessLayout from 'components/business-layout';
import RecentInvitations from 'components/business/invitations/RecentInvitations';
import InvitationStatistics from 'components/business/invitations/InvitationStatistics';
import withCompany from 'components/hocs/withCompany';
import React from 'react';

const Invitations = () => (
  <BusinessLayout pageTitle="Overview">
    <div className="w-full max-w-6xl mx-auto">
      <InvitationStatistics />
      <RecentInvitations />
    </div>
  </BusinessLayout>
);

export default withCompany(Invitations);
