import Link from 'next/link';
import React from 'react';
import Header from './header';

const AdminLayout = ({ pageTitle = 'Dashboard', headerBottom = null, children }) => {
  return (
    <div className="flex flex-row bg-gray-200">
      <div className="w-60 bg-gray-800 text-white min-h-screen relative flex-none">
        <div className="fixed z-20 w-60 ">
          <div className="h-14 flex flex-row items-center px-6 font-bold uppercase">
            Admin Spiking
          </div>
          <ul className="pb-2 mb-2 border-b border-gray-600 space-y-1">
            <li>
              <Link href="/admin">
                <a className="px-6 py-2 block font-semibold hover:bg-gray-700">Dashboard</a>
              </Link>
            </li>
          </ul>
          <ul className="pb-2 mb-2 border-b border-gray-600 space-y-1">
            <li>
              <Link href="/admin/reviews">
                <a className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">Reviews</a>
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link href="/admin/companies">
                <span className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">
                  Companies
                </span>
              </Link>
            </li>
          </ul>
          <ul className="pb-2 space-y-1">
            <li className="cursor-pointer">
              <Link href="/admin/categories">
                <span className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">
                  Categories
                </span>
              </Link>
            </li>

            <li>
              <Link href="/admin/configs">
                <span className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">
                  Configs
                </span>
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link href="/admin/mail-config">
                <span className="px-6 py-1 block font-semibold text-sm hover:bg-gray-700">
                  Mail Server
                </span>
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

export default AdminLayout;
