import BusinessLayout from 'components/business-layout';
import withCompany from 'components/hocs/withCompany';
import Spinner from 'components/common/Spinner';
import { useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import BusinessSelector from 'slices/business/selector';
import { getSession } from 'next-auth/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

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

const InvitationHistory = () => {
  const router = useRouter();
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/business/${currentCompany.domain}/invitations`, {
        params,
      });
      setData(response.data);
    } catch (error) {}
    setIsLoading(false);
  });

  const handleNextPage = async () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: data.current_page + 1 } },
      undefined,
      { shallow: true }
    );
    await getData({ page: data.current_page + 1 });
  };

  const handlePreviousPage = async () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: data.current_page - 1 } },
      undefined,
      { shallow: true }
    );
    await getData({ page: data.current_page - 1 });
  };

  useEffect(() => {
    getData(router.query);
  }, [currentCompany]);

  return (
    <BusinessLayout pageTitle="Invitation History">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white border p-4">
          <table className="table-auto w-full mb-2 text-sm">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Customer Email</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-left">Sent</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Reference Number</th>
              </tr>
            </thead>
            <tbody>
              {data !== null &&
                data.items.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-3 text-left border-t">{row.email}</td>
                    <td className="px-6 py-3 text-left border-t">{row.status}</td>
                    <td className="px-6 py-3 text-left border-t">
                      {dayjs().to(dayjs(row.created_at))}
                    </td>
                    <td className="px-6 py-3 text-left border-t">
                      {row.sent_at === null ? '-' : dayjs().to(dayjs(row.sent_at))}
                    </td>
                    <td className="px-6 py-3 text-left border-t">{row.type}</td>
                    <td className="px-6 py-3 text-left border-t">{row.reference_number}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {data !== null && (
            <div className="flex flex-row justify-center space-x-2">
              {data.current_page > 1 && (
                <button
                  type="button"
                  className="text-center font-semibold px-4 py-2 border bg-white"
                  onClick={handlePreviousPage}
                >
                  Previous page
                </button>
              )}
              {data.current_page < data.last_page && (
                <button
                  type="button"
                  className="text-center text-white font-semibold bg-indigo-600 px-4 py-2 border"
                  onClick={handleNextPage}
                >
                  Next page
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default withCompany(InvitationHistory);
