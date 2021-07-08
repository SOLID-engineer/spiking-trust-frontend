import React, { useEffect, useState } from 'react';
import BusinessSelector from 'slices/business/selector';
import Spinner from 'components/common/Spinner';
import { useSelector } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import {
  INVITATION_STATUSES,
  INVITATION_STATUS_CANCELLED,
  INVITATION_STATUS_DELIVERED,
  INVITATION_STATUS_NOT_DELIVERED,
  INVITATION_STATUS_QUEUED,
  INVITATION_TYPES,
} from 'constants/invitation';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const RecentInvitations = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/business/${currentCompany.domain}/invitations`);
      setData(response.data);
    } catch (error) {}
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentCompany !== null) getData();
  }, [currentCompany]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">Recently invited customers</h2>
        <Link href="/business/invitations/invitation-history">
          <a className="text-blue-600">See full invitation history</a>
        </Link>
      </div>
      <div className="bg-white border p-4 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Spinner />
          </div>
        ) : (
          <>
            <div>
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
                        <td className="px-6 py-3 text-left border-t">
                          <div className="flex flex-row items-center space-x-2">
                            {row.status === INVITATION_STATUS_NOT_DELIVERED && (
                              <div className="w-3 h-3 bg-red-600 rounded-full flex-none"></div>
                            )}
                            {row.status === INVITATION_STATUS_CANCELLED && (
                              <div className="w-3 h-3 bg-gray-200 rounded-full flex-none"></div>
                            )}
                            {row.status === INVITATION_STATUS_DELIVERED && (
                              <div className="w-3 h-3 bg-green-600 rounded-full flex-none"></div>
                            )}
                            {row.status === INVITATION_STATUS_QUEUED && (
                              <div className="w-3 h-3 bg-yellow-300 rounded-full flex-none"></div>
                            )}
                            <span>{INVITATION_STATUSES[row.status]}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-left border-t">
                          {dayjs().to(dayjs(row.created_at))}
                        </td>
                        <td className="px-6 py-3 text-left border-t">
                          {row.sent_at === null ? '-' : dayjs().to(dayjs(row.sent_at))}
                        </td>
                        <td className="px-6 py-3 text-left border-t">
                          {INVITATION_TYPES[row.type]}
                        </td>
                        <td className="px-6 py-3 text-left border-t">{row.reference_number}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentInvitations;
