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
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
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
          </ul>
          <ul className="pb-2 space-y-1">
            <li>
              <a className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">Get Started</a>
            </li>
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
