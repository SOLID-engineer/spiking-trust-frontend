import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessSelector from '../../../slices/business/selector';

const ReviewStatistics = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/business/${currentCompany.domain}/review-statistics`);
      setData(response.data);
    } catch (error) {}
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentCompany !== null) getData();
  }, [currentCompany]);

  return (
    <div>
      {isLoading ? (
        <div className="h-40"></div>
      ) : (
        <>
          {data !== null && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Your reviews</h2>
              <div className="flex flex-row space-x-8">
                <div className="flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border p-2">
                      <h3 className="mb-2 text-lg">Total Reviews</h3>
                      <div className="font-semibold text-2xl">{data.reviews_count}</div>
                    </div>
                    <div className="border p-2">
                      <h3 className="mb-2 text-lg">Verified Reviews</h3>
                      <div className="font-semibold text-2xl">NaN</div>
                    </div>
                    <div className="border p-2">
                      <h3 className="mb-2 text-lg">Non Verified Reviews</h3>
                      <div className="font-semibold text-2xl">NaN</div>
                    </div>
                    <div className="border p-2">
                      <h3 className="mb-2 text-lg">Your Reply Rate</h3>
                      <div className="font-semibold text-2xl">NaN</div>
                    </div>
                  </div>
                </div>
                <div className="flex-none w-96">
                  <div className="mb-2">Star distribution</div>
                  <div className="space-y-2">
                    <div className="flex flex-row items-center text-sm">
                      <div className="flex-none w-12">
                        {`${(((data.stars['5'] || 0) / data.reviews_count) * 100).toFixed(1)}%`}
                      </div>
                      <div className="flex-grow relative bg-gray-100 h-6">
                        <div
                          className="h-6 bg-green-600"
                          style={{
                            width: `${(((data.stars['5'] || 0) / data.reviews_count) * 100).toFixed(
                              1
                            )}%`,
                          }}
                        ></div>
                        <div className="flex flex-row items-center px-2 justify-between absolute inset-0">
                          <span>5 stars</span>
                          <span>{data.stars['5'] || 0} Reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center text-sm">
                      <div className="flex-none w-12">
                        {`${(((data.stars['4'] || 0) / data.reviews_count) * 100).toFixed(1)}%`}
                      </div>
                      <div className="flex-grow relative bg-gray-100 h-6">
                        <div
                          className="h-6 bg-green-500"
                          style={{
                            width: `${(((data.stars['4'] || 0) / data.reviews_count) * 100).toFixed(
                              1
                            )}%`,
                          }}
                        ></div>
                        <div className="flex flex-row items-center px-2 justify-between absolute inset-0">
                          <span>4 stars</span>
                          <span>{data.stars['4'] || 0} Reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center text-sm">
                      <div className="flex-none w-12">
                        {`${(((data.stars['3'] || 0) / data.reviews_count) * 100).toFixed(1)}%`}
                      </div>
                      <div className="flex-grow relative bg-gray-100 h-6">
                        <div
                          className="h-6 bg-yellow-500"
                          style={{
                            width: `${(((data.stars['3'] || 0) / data.reviews_count) * 100).toFixed(
                              1
                            )}%`,
                          }}
                        ></div>
                        <div className="flex flex-row items-center px-2 justify-between absolute inset-0">
                          <span>3 stars</span>
                          <span>{data.stars['3'] || 0} Reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center text-sm">
                      <div className="flex-none w-12">
                        {`${(((data.stars['2'] || 0) / data.reviews_count) * 100).toFixed(1)}%`}
                      </div>
                      <div className="flex-grow relative bg-gray-100 h-6">
                        <div
                          className="h-6 bg-yellow-300"
                          style={{
                            width: `${(((data.stars['2'] || 0) / data.reviews_count) * 100).toFixed(
                              1
                            )}%`,
                          }}
                        ></div>
                        <div className="flex flex-row items-center px-2 justify-between absolute inset-0">
                          <span>2 stars</span>
                          <span>{data.stars['2'] || 0} Reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center text-sm">
                      <div className="flex-none w-12">
                        {`${(((data.stars['1'] || 0) / data.reviews_count) * 100).toFixed(1)}%`}
                      </div>
                      <div className="flex-grow relative bg-gray-100 h-6">
                        <div
                          className="h-6 bg-red-500"
                          style={{
                            width: `${(((data.stars['1'] || 0) / data.reviews_count) * 100).toFixed(
                              1
                            )}%`,
                          }}
                        ></div>
                        <div className="flex flex-row items-center px-2 justify-between absolute inset-0">
                          <span>1 stars</span>
                          <span>{data.stars['1'] || 0} Reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewStatistics;
