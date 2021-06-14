/* eslint-disable react/jsx-props-no-spreading */
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import React from 'react';
import SessionSelector from '../../slices/session/selector';

const PrivateRoute = (WrappedComponent) => (props) => {
  const router = useRouter();
  const isAuthenticated = useSelector(SessionSelector.isAuthenticated);
  if (!isAuthenticated)
    router.push(`/login?returnUrl=${window.location.pathname}${window.location.search}`);
  return <WrappedComponent {...props} />;
};

export default PrivateRoute;
