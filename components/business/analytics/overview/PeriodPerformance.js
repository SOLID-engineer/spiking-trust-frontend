import React, { useState, useEffect } from 'react';
import Spinner from 'components/common/Spinner';
import { useSelector } from 'react-redux';
import BusinessSelector from 'slices/business/selector';
import axios from 'axios';
import {
  REVIEW_SOURCES,
  REVIEW_SOURCE_MANUAL_INVITATION,
  REVIEW_SOURCE_ORGANIC,
} from 'constants/review';

const PeriodPerformance = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/business/${currentCompany.domain}/statistics/period-performance`
      );
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
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        )}

        {!isLoading && data !== null && (
          <>
            <h3 className="font-semibold text-lg mb-4">Distribution of stars</h3>
            <div className="text-sm flex flex-col space-y-4">
              <div>
                <div className="flex flex-row items-center justify-between mb-2">
                  <span>5 star reviews</span>
                  <span>
                    {(((data.star_distribution[5] || 0) / data.total_review_count) * 100).toFixed(
                      0
                    )}
                    % ({data.star_distribution[5] || 0})
                  </span>
                </div>
                <div className="h-5 bg-gray-100">
                  <div
                    className="h-5 inline-block"
                    style={{
                      backgroundColor: '#00b67a',
                      width: `${(
                        ((data.star_distribution[5] || 0) / data.total_review_count) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-between mb-2">
                  <span>4 star reviews</span>
                  <span>
                    {(((data.star_distribution[4] || 0) / data.total_review_count) * 100).toFixed(
                      0
                    )}
                    % ({data.star_distribution[4] || 0})
                  </span>
                </div>
                <div className="h-5 bg-gray-100">
                  <div
                    className="h-5 inline-block"
                    style={{
                      backgroundColor: '#73CF11',
                      width: `${(
                        ((data.star_distribution[4] || 0) / data.total_review_count) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-between mb-2">
                  <span>3 star reviews</span>
                  <span>
                    {(((data.star_distribution[3] || 0) / data.total_review_count) * 100).toFixed(
                      0
                    )}
                    % ({data.star_distribution[3] || 0})
                  </span>
                </div>
                <div className="h-5 bg-gray-100">
                  <div
                    className="h-5 inline-block"
                    style={{
                      backgroundColor: '#ffce00',
                      width: `${(
                        ((data.star_distribution[3] || 0) / data.total_review_count) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-between mb-2">
                  <span>2 star reviews</span>
                  <span>
                    {(((data.star_distribution[2] || 0) / data.total_review_count) * 100).toFixed(
                      0
                    )}
                    % ({data.star_distribution[2] || 0})
                  </span>
                </div>
                <div className="h-5 bg-gray-100">
                  <div
                    className="h-5 inline-block"
                    style={{
                      backgroundColor: '#ff8622',
                      width: `${(
                        ((data.star_distribution[2] || 0) / data.total_review_count) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-between mb-2">
                  <span>1 star reviews</span>
                  <span>
                    {(((data.star_distribution[1] || 0) / data.total_review_count) * 100).toFixed(
                      0
                    )}
                    % ({data.star_distribution[1] || 0})
                  </span>
                </div>
                <div className="h-5 bg-gray-100">
                  <div
                    className="h-5 inline-block"
                    style={{
                      backgroundColor: '#ff3722',
                      width: `${(
                        ((data.star_distribution[1] || 0) / data.total_review_count) *
                        100
                      ).toFixed(0)}%`,
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
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        )}
        {!isLoading && data !== null && (
          <>
            <h3 className="font-semibold text-lg mb-4">Source of reviews</h3>
            <div className="text-sm flex flex-col space-y-4">
              {data?.review_sources?.[REVIEW_SOURCE_ORGANIC] && (
                <div>
                  <div className="flex flex-row items-center justify-between mb-2">
                    <span>{REVIEW_SOURCES[REVIEW_SOURCE_ORGANIC]}</span>
                    <span>
                      {(
                        ((data.review_sources?.[REVIEW_SOURCE_ORGANIC] || 0) /
                          data.total_review_count) *
                        100
                      ).toFixed(0)}
                      % ({data?.review_sources?.[REVIEW_SOURCE_ORGANIC]})
                    </span>
                  </div>
                  <div className="h-5 bg-gray-100">
                    <div
                      className="h-5 inline-block"
                      style={{
                        backgroundColor: 'rgb(77, 110, 198)',
                        width: `${(
                          ((data.review_sources?.[REVIEW_SOURCE_ORGANIC] || 0) /
                            data.total_review_count) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
              {data?.review_sources?.[REVIEW_SOURCE_MANUAL_INVITATION] && (
                <div>
                  <div className="flex flex-row items-center justify-between mb-2">
                    <span>{REVIEW_SOURCES[REVIEW_SOURCE_MANUAL_INVITATION]}</span>
                    <span>
                      {(
                        ((data.review_sources?.[REVIEW_SOURCE_MANUAL_INVITATION] || 0) /
                          data.total_review_count) *
                        100
                      ).toFixed(0)}
                      % ({data?.review_sources?.[REVIEW_SOURCE_MANUAL_INVITATION]})
                    </span>
                  </div>
                  <div className="h-5 bg-gray-100">
                    <div
                      className="h-5 inline-block"
                      style={{
                        backgroundColor: 'rgb(77, 110, 198)',
                        width: `${(
                          ((data.review_sources?.[REVIEW_SOURCE_MANUAL_INVITATION] || 0) /
                            data.total_review_count) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PeriodPerformance;
