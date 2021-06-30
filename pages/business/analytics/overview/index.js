import BusinessLayout from 'components/business-layout';
import withCompany from 'components/hocs/withCompany';
import React from 'react';

const Overview = () => (
  <BusinessLayout pageTitle="Overview">
    <div></div>
  </BusinessLayout>
);

export default withCompany(Overview);
