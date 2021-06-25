import Dropdown from 'components/common/Dropdown';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCompany } from '../../slices/business';
import BusinessSelector from '../../slices/business/selector';
import Header from './Header';

const BusinessLayout = ({ pageTitle, headerBottom = null, children }) => {
  const companies = useSelector(BusinessSelector.selectCompanies);
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const dispatch = useDispatch();

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
                  <Link href="/business/invitations">
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
