import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanies, selectCompany } from '../../slices/business';
import BusinessSelector from '../../slices/business/selector';
import Header from './Header';

const BusinessLayout = ({ pageTitle, headerBottom = null, children }) => {
  const companies = useSelector(BusinessSelector.selectCompanies);
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const dispatch = useDispatch();

  useEffect(() => {
    if (companies === null) dispatch(getCompanies());
  }, []);

  useEffect(() => {
    if (currentCompany === null && companies?.[0] !== undefined)
      dispatch(selectCompany(companies[0]));
  }, [companies]);

  return (
    <div className="flex flex-row bg-gray-200">
      <div className="w-60 bg-gray-800 text-white min-h-screen relative flex-none">
        <div className="fixed z-20 w-60 ">
          <div className="h-14">
            {currentCompany !== null && (
              <div className="h-14 flex flex-row items-center px-6 font-bold">
                {currentCompany.domain}
              </div>
            )}
            <div className="hidden">
              {companies !== null &&
                companies.map((company) => <div key={company.id}>{company.domain}</div>)}
            </div>
          </div>
          <ul className="pb-2 mb-2 border-b border-gray-600 space-y-1">
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
              <a className="px-6 py-2 block font-semibold hover:bg-gray-700">Get Reviews</a>
            </li>
            <li>
              <a className="px-6 py-2 block font-semibold hover:bg-gray-700">Analytics</a>
            </li>
          </ul>
          <ul className="pb-2 space-y-1">
            <li>
              <a className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">Get Started</a>
            </li>
            <li>
              <a className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">Settings</a>
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
