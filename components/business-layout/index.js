import Dropdown from 'components/common/Dropdown';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCompany } from 'slices/business';
import BusinessSelector from 'slices/business/selector';
import { useRouter } from 'next/router';
import { startsWith } from 'lodash';
import Header from './Header';

const BusinessLayout = ({ pageTitle, headerBottom = null, children }) => {
  const router = useRouter();
  const companies = useSelector(BusinessSelector.selectCompanies);
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="lg:pl-60 flex flex-row pl-0">
      <div
        className={`w-60 bg-gray-800 text-white min-h-full h-full z-40 transition-transform transform fixed left-0 top-0 ${
          isSidebarCollapsed ? '-translate-x-60 lg:translate-x-0' : 'translate-x-0'
        }`}
      >
        <div className="w-60">
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
                    <div className="absolute w-full inset-x-0 text-gray-800 px-2 z-30">
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
          <ul className="pb-2 mb-2 border-b border-gray-700 space-y-1 aside-menu">
            <li className={router.pathname === '/business' ? 'active' : ''}>
              <Link href="/business">
                <a className="px-6 py-2 block font-semibold hover:bg-gray-700">Home</a>
              </Link>
            </li>
            <li className={router.pathname === '/business/reviews' ? 'active' : ''}>
              <Link href="/business/reviews">
                <a className="px-6 py-2 block font-semibold hover:bg-gray-700">Reviews</a>
              </Link>
            </li>
            <li
              className={`${startsWith(router.pathname, '/business/invitations') ? 'active' : ''} ${
                activeMenu === 'menu-invitations' ||
                (activeMenu === null && startsWith(router.pathname, '/business/invitations'))
                  ? 'current'
                  : ''
              }`}
            >
              <a
                className="px-6 py-2 font-semibold hover:bg-gray-700 flex flex-row justify-between items-center"
                role="button"
                aria-hidden="true"
                onClick={() => {
                  setActiveMenu('menu-invitations');
                }}
              >
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
              <ul className="sub-menu">
                <li className={router.pathname === '/business/invitations' ? 'active' : ''}>
                  <Link href="/business/invitations">
                    <a className="px-6 py-2 block hover:bg-gray-700 text-sm">Overview</a>
                  </Link>
                </li>
                <li
                  className={
                    router.pathname ===
                    '/business/invitations/invite-customers/upload-service-reviews'
                      ? 'active'
                      : ''
                  }
                >
                  <Link href="/business/invitations/invite-customers/upload-service-reviews">
                    <a className="px-6 py-2 block hover:bg-gray-700 text-sm">Invite Customers</a>
                  </Link>
                </li>
              </ul>
            </li>
            <li
              className={`${startsWith(router.pathname, '/business/analytics') ? 'active' : ''} ${
                activeMenu === 'menu-analytics' ||
                (activeMenu === null && startsWith(router.pathname, '/business/analytics'))
                  ? 'current'
                  : ''
              }`}
            >
              <a
                className="px-6 py-2 font-semibold hover:bg-gray-700 flex flex-row justify-between items-center"
                role="button"
                aria-hidden="true"
                onClick={() => {
                  setActiveMenu('menu-analytics');
                }}
              >
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
              <ul className="sub-menu">
                <li className={router.pathname === '/business/analytics/overview' ? 'active' : ''}>
                  <Link href="/business/analytics/overview">
                    <a className="px-6 py-2 block hover:bg-gray-700 text-sm">Overview</a>
                  </Link>
                </li>
                <li className={router.pathname === '/business/analytics/benchmark' ? 'active' : ''}>
                  <Link href="/business/analytics/benchmark">
                    <a className="px-6 py-2 block hover:bg-gray-700 text-sm">Benchmark</a>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="pb-2 space-y-1 aside-menu">
            {/* <li>
              <a className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">Get Started</a>
            </li> */}
            <li className={startsWith(router.pathname, '/business/settings') ? 'active' : ''}>
              <Link href="/business/settings">
                <a className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">Settings</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-gray-600 z-30 opacity-60 lg:hidden"
          role="button"
          aria-hidden="true"
          onClick={() => {
            setIsSidebarCollapsed((prevState) => !prevState);
          }}
        ></div>
      )}
      <div className="flex-grow relative min-w-0">
        <div className="lg:hidden bg-gray-800 text-white h-14 w-full flex flex-row items-center px-4 space-x-4">
          <button
            type="button"
            className="block w-8 h-8 p-1.5"
            onClick={() => {
              setIsSidebarCollapsed((prevState) => !prevState);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <span className="font-semibold text-lg">{currentCompany.domain}</span>
        </div>
        <Header pageTitle={pageTitle} headerBottom={headerBottom} />
        <div className="p-6 w-full">{children}</div>
      </div>
    </div>
  );
};

export default BusinessLayout;
