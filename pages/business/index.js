import { getSession } from 'next-auth/client';
import React from 'react';
import { useSelector } from 'react-redux';

import BusinessLayout from 'components/business-layout';
import Engage from 'components/business/dashboard/Engage';
import Overall from 'components/business/dashboard/Overall';
import ReviewStatistics from 'components/business/dashboard/ReviewStatistics';
import BusinessSelector from 'slices/business/selector';
import withCompany from 'components/hocs/withCompany';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/login?returnUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

const Business = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  return (
    <BusinessLayout pageTitle="Dashboard">
      {currentCompany !== null && (
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-row justify-between items-center mb-4">
            <div>
              See what’s happening with <strong>{currentCompany?.domain}</strong>
            </div>
            <div className="flex flex-row space-x-1">
              <button type="button" className="border px-3 py-1 border-gray-300 bg-white">
                Today
              </button>
              <button type="button" className="border px-3 py-1 border-gray-300 bg-white">
                7 days
              </button>
              <button type="button" className="border px-3 py-1 border-gray-300 bg-white">
                28 days
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-3">
              <Overall />
            </div>
            <div className="bg-white p-3">
              <Engage />
            </div>
            <div className="lg:col-span-2 bg-white p-3">
              <ReviewStatistics />
            </div>
          </div>
        </div>
      )}
    </BusinessLayout>
  );
};

export default withCompany(Business);
