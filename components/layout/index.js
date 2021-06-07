import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import SessionSelector from '../../slices/session/selector';
import { logout } from '../../slices/session';

export default function Layout({ children }) {
  const session = useSelector(SessionSelector.getSession);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
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
              {session.user && (
                <li className="relative dropdown">
                  <Link href="/settings">
                    <a className="block h-16 flex items-center px-4">{session.user.first_name}</a>
                  </Link>
                  <div className="dropdown-menu">
                    <ul>
                      <li>
                        <a className="px-6 py-3 block cursor-pointer" onClick={handleLogout}>
                          Log out
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              )}
              {!session.isAuthenticated && (
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
      <footer className="text-white bg-indigo-800 py-14 text-gray-200">
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
