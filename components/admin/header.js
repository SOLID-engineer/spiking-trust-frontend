import { signOut, useSession } from 'next-auth/client';
import React from 'react';
import Dropdown from 'components/common/Dropdown';

const Header = ({ pageTitle, headerBottom = null }) => {
  const [session, loading] = useSession();

  return (
    <div className="bg-white shadow-sm">
      <div className="h-14 flex flex-row justify-between items-center w-full px-6">
        <h1 className="font-semibold text-lg">{pageTitle}</h1>
        <div className="flex flex-row items-center space-x-2">
          <Dropdown
            button={
              <a className="block w-8 h-8 p-1.5 border rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-user"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </a>
            }
            dropdown={
              <>
                {session && (
                  <div className="bg-white border absolute right-0 top-full w-56 mt-2 z-40">
                    <div className="p-4 border-b">
                      <div className="font-semibold">{session.user.first_name}</div>
                      <div className="text-gray-600 text-sm">{session.user.email}</div>
                    </div>
                    <div className="text-sm">
                      <ul>
                        <li>
                          <a
                            role="button"
                            className="block px-4 py-2 hover:bg-gray-100"
                            aria-hidden="true"
                            onClick={() => {
                              signOut({ callbackUrl: '/' });
                            }}
                          >
                            Logout
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </>
            }
          />
        </div>
      </div>
      {headerBottom}
    </div>
  );
};

export default Header;
