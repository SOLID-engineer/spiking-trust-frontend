import React from 'react';

import AdminLayout from 'components/admin';
import PrivateRoute from '../../components/routes/PrivateRoute';

import SessionSelector from '../../slices/session/selector';
import { wrapper } from '../../slices/store';

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  const session = SessionSelector.getSession(store.getState());
  if (!session.isAuthenticated) {
    return {
      redirect: {
        destination: `/login?returnUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  return {};
});

const Business = () => {
  return <AdminLayout></AdminLayout>;
};

export default PrivateRoute(Business);
