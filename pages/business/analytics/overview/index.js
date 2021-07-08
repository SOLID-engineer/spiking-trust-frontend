import BusinessLayout from 'components/business-layout';
import withCompany from 'components/hocs/withCompany';
import Charts from 'components/business/analytics/overview/Charts';
import PeriodPerformance from 'components/business/analytics/overview/PeriodPerformance';
import Engagement from 'components/business/analytics/overview/Engagement';
import React from 'react';

const Overview = () => (
  <BusinessLayout pageTitle="Overview">
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="font-semibold text-lg mb-4">Your performance in the last 28 days</h2>
      <Charts />
      <PeriodPerformance />
      <h2 className="font-semibold text-lg mb-4">
        How you’ve replied to negative reviews in the past 12 months
      </h2>
      <Engagement />
    </div>
  </BusinessLayout>
);

export default withCompany(Overview);
