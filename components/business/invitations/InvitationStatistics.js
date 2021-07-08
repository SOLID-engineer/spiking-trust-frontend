import React, { useState, useEffect } from 'react';
import Spinner from 'components/common/Spinner';
import { useSelector } from 'react-redux';
import BusinessSelector from 'slices/business/selector';
import axios from 'axios';

const InvitationStatistics = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/business/${currentCompany.domain}/invitation-statistics`);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, [currentCompany]);

  return (
    <div className="mb-8">
      <h2 className="font-semibold text-lg mb-2">Your performance in the last 28 days</h2>
      <div className="bg-white p-4">
        {isLoading && (
          <div className="flex justify-center items-center h-20">
            <Spinner />
          </div>
        )}
        {!isLoading && data !== null && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <div className="font-semibold text-2xl">{data.number_of_invitations_delivered}</div>
              <div className="text-gray-400">Invitations delivered</div>
            </div>
            <div>
              <div className="font-semibold text-2xl">
                {data.number_of_invitations_not_delivered}
              </div>
              <div className="text-gray-400">Invitations not delivered</div>
            </div>
            <div>
              <div className="font-semibold text-2xl">{data.number_of_invitations_cancelled}</div>
              <div className="text-gray-400">Invitations cancelled</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationStatistics;
