import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessSelector from 'slices/business/selector';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import Spinner from 'components/common/Spinner';

const Charts = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [currentTab, setCurrentTab] = useState('reviews-collected');
  const [reviewsNumbersOverviewData, setReviewsNumbersOverviewData] = useState(null);
  const [invitationsOverviewData, setInvitationsOverviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getReviewsNumbersOverviewData = async () => {
    try {
      const response = await axios.get(
        `/business/${currentCompany.domain}/statistics/reviews-numbers-overview`
      );
      setReviewsNumbersOverviewData(response.data);
    } catch (error) {}
  };

  const getInvitationsOverviewData = async () => {
    try {
      const response = await axios.get(
        `/business/${currentCompany.domain}/statistics/invitations-overview`
      );
      setInvitationsOverviewData(response.data);
    } catch (error) {}
  };

  const getData = async () => {
    setIsLoading(true);
    await getReviewsNumbersOverviewData();
    await getInvitationsOverviewData();
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [currentCompany]);

  return (
    <div className="bg-white mb-4 border">
      {isLoading && (
        <div className="flex justify-center items-center h-80">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex flex-row">
            <div
              role="button"
              aria-hidden="true"
              className={`flex-1 p-6 ${
                currentTab === 'reviews-collected' ? 'bg-white' : 'bg-gray-100'
              }`}
              onClick={() => {
                setCurrentTab('reviews-collected');
              }}
            >
              <div className="mb-2">Reviews collected</div>
              <div className="flex flex-row items-end space-x-4">
                <span className="font-semibold text-4xl">
                  {reviewsNumbersOverviewData?.current_period_review_count}
                </span>
                <span className="text-green-600">
                  {reviewsNumbersOverviewData?.previous_period_review_count === 0
                    ? 100
                    : parseFloat(
                        (reviewsNumbersOverviewData?.current_period_review_count -
                          reviewsNumbersOverviewData?.previous_period_review_count /
                            reviewsNumbersOverviewData?.previous_period_review_count) *
                          100
                      ).toFixed(0)}{' '}
                  %
                </span>
              </div>
            </div>
            <div
              role="button"
              aria-hidden="true"
              className={`flex-1 p-6 ${
                currentTab === 'invitations-delivered' ? 'bg-white' : 'bg-gray-100'
              }`}
              onClick={() => {
                setCurrentTab('invitations-delivered');
              }}
            >
              <div className="mb-2">Invitations delivered</div>
              <div className="flex flex-row items-end space-x-4">
                <span className="font-semibold text-4xl">
                  {invitationsOverviewData?.current_period_invitation_count}
                </span>
                <span className="text-green-600">
                  {invitationsOverviewData?.previous_period_invitation_count === 0
                    ? 100
                    : parseFloat(
                        (invitationsOverviewData?.current_period_invitation_count -
                          invitationsOverviewData?.previous_period_invitation_count /
                            invitationsOverviewData?.previous_period_invitation_count) *
                          100
                      ).toFixed(0)}{' '}
                  %
                </span>
              </div>
            </div>
          </div>
          <div className={`h-96 p-6 ${currentTab === 'reviews-collected' ? 'block' : 'hidden'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reviewsNumbersOverviewData?.current_period}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickMargin={10}
                  tickFormatter={(value, index) => (index % 6 ? '' : dayjs(value).format('MMM DD'))}
                  type="category"
                  interval={0}
                />
                <YAxis tickMargin={10} axisLine={false} />
                <Legend layout="vertical" />
                <Tooltip
                  cursor={{ opacity: 0.5 }}
                  labelFormatter={(label, payload) => dayjs(label).format('MMM DD, YYYY')}
                />
                <Bar dataKey="review_count" name="Number of reviews" fill="rgb(77, 110, 198)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div
            className={`h-96 p-6 ${currentTab === 'invitations-delivered' ? 'block' : 'hidden'}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={invitationsOverviewData?.current_period}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickMargin={10}
                  tickFormatter={(value, index) => (index % 6 ? '' : dayjs(value).format('MMM DD'))}
                  type="category"
                  interval={0}
                />
                <YAxis tickMargin={10} axisLine={false} />
                <Legend layout="vertical" verticalAlign="bottom" />
                <Tooltip
                  cursor={{ opacity: 0.5 }}
                  labelFormatter={(label, payload) => dayjs(label).format('MMM DD, YYYY')}
                />
                <Bar dataKey="delivered" name="Invitations delivered" fill="rgb(77, 110, 198)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Charts;
