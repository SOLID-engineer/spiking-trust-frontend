import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessSelector from 'slices/business/selector';
import Spinner from 'components/common/Spinner';
import dayjs from 'dayjs';

const duration = require('dayjs/plugin/duration');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);
dayjs.extend(duration);

const Engagement = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/business/${currentCompany.domain}/statistics/engagement`);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, [currentCompany]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-white p-4 border">
        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        )}
        {!isLoading && data !== null && (
          <>
            <h3 className="font-semibold text-lg mb-4">Reply rate (public)</h3>
            <div className="text-sm flex flex-col space-y-4">
              <div>
                <div className="flex flex-row items-center justify-between mb-2">
                  <span>2-star reviews</span>
                  <span>
                    {data.reviews?.[2]
                      ? `${(((data.replies?.[2] || 0) / data.reviews?.[2]) * 100).toFixed(0)}%`
                      : '-'}
                  </span>
                </div>
                <div className="h-5 bg-gray-100">
                  <div
                    className="h-5 inline-block"
                    style={{
                      backgroundColor: 'rgb(77, 110, 198)',
                      width: `${
                        data.reviews?.[2]
                          ? `${(((data.replies?.[2] || 0) / data.reviews?.[2]) * 100).toFixed(0)}`
                          : '0'
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-between mb-2">
                  <span>1-star reviews</span>
                  <span>
                    {data.reviews?.[1]
                      ? `${(((data.replies?.[1] || 0) / data.reviews?.[1]) * 100).toFixed(0)}%`
                      : '-'}
                  </span>
                </div>
                <div className="h-5 bg-gray-100">
                  <div
                    className="h-5 inline-block"
                    style={{
                      backgroundColor: 'rgb(77, 110, 198)',
                      width: `${
                        data.reviews?.[1]
                          ? `${(((data.replies?.[1] || 0) / data.reviews?.[1]) * 100).toFixed(0)}`
                          : '0'
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="bg-white p-4 border">
        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        )}
        {!isLoading && data !== null && (
          <>
            <h3 className="font-semibold text-lg mb-4">Time to reply (public)</h3>
            <div className="text-sm flex flex-col divide-y">
              <div className="flex flex-row items-center justify-between py-2">
                <span>2-star reviews</span>
                <span>
                  {data.average_reply_time_per_star?.[2]
                    ? dayjs.duration(data.average_reply_time_per_star?.[2] * 1000).humanize()
                    : '-'}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between py-2">
                <span>1-star reviews</span>
                <span>
                  {data.average_reply_time_per_star?.[1]
                    ? dayjs.duration(data.average_reply_time_per_star?.[1] * 1000).humanize()
                    : '-'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Engagement;
