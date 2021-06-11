/* eslint-disable react/jsx-props-no-spreading */
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import React from 'react';
import SessionSelector from '../../slices/session/selector';

const AuthRoute = (WrappedComponent) => (props) => {
  const router = useRouter();
  const isAuthenticated = useSelector(SessionSelector.isAuthenticated);
  const { returnUrl } = router.query;
  if (isAuthenticated) router.push(returnUrl || '/');
  return <WrappedComponent {...props} />;
};

export default AuthRoute;
