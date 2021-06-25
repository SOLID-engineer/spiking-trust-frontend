/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import BusinessSelector from 'slices/business/selector';
import { getCompanies, selectCompany } from 'slices/business';

const withCompany = (WrappedComponent) => (props) => {
  const companies = useSelector(BusinessSelector.selectCompanies);
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      await dispatch(getCompanies());
      setIsLoading(false);
    };
    if (companies === null) getData();
    else setIsLoading(false);
  }, []);

  useEffect(() => {
    if (currentCompany === null && companies?.[0] !== undefined)
      dispatch(selectCompany(companies[0]));
  }, [companies]);

  if (isLoading)
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="flex flex-row space-x-1">
          <div className="flex items-center justify-center w-6 h-6 text-sm bg-red-500 text-white p-0.5 animate-spinner-one">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FFFFFF"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-star"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div className="flex items-center justify-center w-6 h-6 text-sm bg-yellow-300 text-white p-0.5 animate-spinner-two">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FFFFFF"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-star"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div className="flex items-center justify-center w-6 h-6 text-sm bg-yellow-500 text-white p-0.5 animate-spinner-three">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FFFFFF"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-star"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div className="flex items-center justify-center w-6 h-6 text-sm bg-green-500 text-white p-0.5 animate-spinner-four">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FFFFFF"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-star"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div className="flex items-center justify-center w-6 h-6 text-sm bg-green-600 text-white p-0.5 animate-spinner-five">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FFFFFF"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-star"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
        </div>
      </div>
    );

  if (!isLoading && companies !== null && companies.length === 0)
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <div className="text-center mx-auto max-w-lg w-full">
          <h2 className="mb-4 text-lg">
            Claim your company to access business tools and start getting closer to your customers
            today!
          </h2>
          <div>
            <Link href="/claim-company">
              <a className="px-4 py-2 border bg-indigo-600 text-white border-indigo-600 inline-block">
                Claim a company
              </a>
            </Link>
          </div>
        </div>
      </div>
    );

  if (currentCompany === null) return null;
  return <WrappedComponent {...props} />;
};

export default withCompany;
