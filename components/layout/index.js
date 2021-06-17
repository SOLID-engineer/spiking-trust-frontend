/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/client';

export default function Layout({ children }) {
  const [session, loading] = useSession();

  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="pt-16 relative">
      <header className="text-white bg-indigo-800 fixed left-0 right-0 top-0 z-30">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-row h-16 justify-between items-center">
            <Link href="/">
              <a className="font-bold text-lg">Spiking Trust</a>
            </Link>
            <ul className="flex flex-row header-menu">
              <li>
                <Link href="/categories">
                  <a>Categories</a>
                </Link>
              </li>
              {session ? (
                <li className="relative dropdown">
                  <Link href="/settings">
                    <a className="block h-16 items-center px-4">{session.user.first_name}</a>
                  </Link>
                  <div className="dropdown-menu">
                    <ul>
                      <li>
                        <Link href="/business">
                          <a className="px-6 py-3 block cursor-pointer">My Companies</a>
                        </Link>
                      </li>
                      <li>
                        <a className="px-6 py-3 block cursor-pointer" onClick={handleLogout}>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              ) : (
                <li>
                  <Link href="/login">
                    <a>Login</a>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>
      <div>{children}</div>
      <footer className="bg-indigo-800 py-14 text-gray-200">
        <div className="w-full max-w-6xl mx-auto">
          <ul className="flex flex-row space-x-8 mb-8">
            <li>
              <a>Legal</a>
            </li>
            <li>
              <a>Privacy Policy</a>
            </li>
            <li>
              <a>Terms & Conditions</a>
            </li>
          </ul>
          <div>© 2021 Spiking Trust, Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
