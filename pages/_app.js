/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { getSession, Provider as AuthProvider, signOut, useSession } from 'next-auth/client';

import store from 'slices/store';
import { reset } from 'slices/session';
import 'styles/tailwind.css';
import 'styles/global.scss';

const TIMEOUT = 1 * 30 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(reset());
      signOut({ callbackUrl: '/' });
    }
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session) config.headers.Authorization = `Bearer ${session.accessToken}`;
  return config;
});

function App({ Component, pageProps }) {
  const [session, loading] = useSession();
  useEffect(() => {}, [session]);
  return (
    <>
      <AuthProvider session={pageProps.session}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </AuthProvider>
    </>
  );
}

export default App;
