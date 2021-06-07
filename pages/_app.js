import React, { useEffect } from 'react';
import axios from 'axios';

import store, { wrapper } from '../slices/store';
import '../styles/tailwind.css';
import '../styles/global.scss';
import { getUser } from '../slices/session';
import { useDispatch, useSelector } from 'react-redux';
import SessionSelector from '../slices/session/selector';

const TIMEOUT = 1 * 30 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
axios.interceptors.request.use((config) => {
  const {
    session: { accessToken, isAuthenticated },
  } = store.getState();
  if (isAuthenticated) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(SessionSelector.isAuthenticated);
  const user = useSelector(SessionSelector.getUser);
  useEffect(() => {
    if (isAuthenticated && user === null) dispatch(getUser());
  }, [isAuthenticated]);
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = wrapper.getInitialAppProps();

export default wrapper.withRedux(MyApp);
