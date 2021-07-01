/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/client';
import Image from 'next/image';

export default function Layout({ children }) {
  const [session, loading] = useSession();
  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: '/' });
  };
  return (
    <div className="pt-14 relative">
      <header
        className="text-white fixed left-0 right-0 top-0 z-30"
        style={{ backgroundColor: '#1e1e2e' }}
      >
        <div className="w-full max-w-6xl mx-auto px-4 lg:px-0">
          <div className="flex flex-row h-14 justify-between items-center">
            <Link href="/">
              <a className="h-auto inline-block leading-none">
                <Image src="/images/logo.png" width="88" height="38" />
              </a>
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
                    <a className="block h-16 items-center px-4">{session?.user?.first_name}</a>
                  </Link>
                  <div className="dropdown-menu">
                    <ul>
                      <li>
                        <Link href="/business">
                          <a className="px-6 py-3 block cursor-pointer">Business Dashboard</a>
                        </Link>
                      </li>
                      {session?.user?.role && (
                        <li>
                          <Link href="/admin">
                            <a className="px-6 py-3 block cursor-pointer">Admin Dashboard</a>
                          </Link>
                        </li>
                      )}
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
      <footer className="py-14 text-gray-200" style={{ backgroundColor: '#1e1e2e' }}>
        <div className="w-full max-w-6xl mx-auto px-4 lg:px-0">
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
