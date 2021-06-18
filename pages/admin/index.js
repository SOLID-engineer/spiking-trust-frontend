import React from 'react';

import AdminLayout from 'components/admin';
import { getSession } from 'next-auth/client';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/login?returnUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

const Business = () => {
  return <AdminLayout></AdminLayout>;
};

export default Business;
