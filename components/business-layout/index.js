import Dropdown from 'components/common/Dropdown';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanies, selectCompany } from '../../slices/business';
import BusinessSelector from '../../slices/business/selector';
import Header from './Header';

const BusinessLayout = ({ pageTitle, headerBottom = null, children }) => {
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

  return (
    <div className="flex flex-row bg-gray-200 transform">
      <div className="w-60 bg-gray-800 text-white min-h-screen flex-none fixed z-40 -left-60 lg:relative lg:left-0">
        <div className="fixed z-20 w-60 ">
          <div className="h-14">
            {currentCompany !== null && (
              <>
                <Dropdown
                  button={
                    <div className="h-14 flex flex-row items-center px-6 font-bold justify-between border-b border-gray-700">
                      <span>{currentCompany.domain}</span>
                      <span className="block h-5 w-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-chevron-down"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </div>
                  }
                  dropdown={
                    <div className="absolute w-full inset-x-0 text-gray-800 px-2">
                      <div className="bg-white p-2 shadow">
                        {companies !== null &&
                          companies.map((company) => (
                            <button
                              type="button"
                              key={company.id}
                              className="px-3 py-2 hover:bg-gray-100 w-full block text-left"
                              onClick={() => {
                                dispatch(selectCompany(company));
                              }}
                            >
                              {company.domain}
                            </button>
                          ))}
                      </div>
                    </div>
                  }
                />
              </>
            )}
          </div>
          <ul className="pb-2 mb-2 border-b border-gray-700 space-y-1">
            <li>
              <Link href="/business">
                <a className="px-6 py-2 block font-semibold hover:bg-gray-700">Home</a>
              </Link>
            </li>
            <li>
              <Link href="/business/reviews">
                <a className="px-6 py-2 block font-semibold hover:bg-gray-700">Reviews</a>
              </Link>
            </li>
            <li>
              <a className="px-6 py-2 font-semibold hover:bg-gray-700 flex flex-row justify-between items-center">
                <span>Get Reviews</span>
                <span className="block h-5 w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevron-down"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </a>
              <ul>
                <li>
                  <Link href="/business/analytics/overview">
                    <a className="px-6 py-2 block hover:bg-gray-700 text-sm">Overview</a>
                  </Link>
                </li>
                <li>
                  <Link href="/business/invitations/invite-customers/upload-service-reviews">
                    <a className="px-6 py-2 block hover:bg-gray-700 text-sm">Invite Customers</a>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <a className="px-6 py-2 font-semibold hover:bg-gray-700 flex flex-row justify-between items-center">
                <span>Analytics</span>
                <span className="block h-5 w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevron-down"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </a>
              <ul>
                <li>
                  <Link href="/business/analytics/overview">
                    <a className="px-6 py-2 block hover:bg-gray-700 text-sm">Overview</a>
                  </Link>
                </li>
                <li>
                  <Link href="/business/analytics/benchmark">
                    <a className="px-6 py-2 block hover:bg-gray-700 text-sm">Benchmark</a>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="pb-2 space-y-1">
            {/* <li>
              <a className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">Get Started</a>
            </li> */}
            <li>
              <Link href="/business/settings">
                <a className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">Settings</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-grow relative min-w-0">
        <Header pageTitle={pageTitle} headerBottom={headerBottom} />
        <div className="p-6 w-full">{children}</div>
      </div>
    </div>
  );
};

export default BusinessLayout;
