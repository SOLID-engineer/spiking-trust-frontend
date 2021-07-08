import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/admin';

import axios from 'axios';
import dayjs from 'dayjs';
import Paginate from 'components/admin/paginate';

import { getSession } from 'next-auth/client';
import router from 'next/router';
import Spinner from 'components/common/Spinner';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const { query } = context;
  if (!session) {
    return {
      redirect: {
        destination: `/login?returnUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  return { props: { query } };
};

const AdminUsers = ({ query }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pages, setPages] = useState({
    current_page: query?.page || 1,
    last_page: 0,
    total: 0,
    per_page: 20,
  });

  const getUsers = async (params = {}) => {
    setLoading(true);
    const response = await axios.get('/admin/users', { params });
    const { data = [] } = response;
    setUsers(data.items);
    setPages({
      current_page: data.current_page,
      last_page: data.last_page,
      total: data.total,
      per_page: data.per_page,
    });
    setLoading(false);
  };

  const changePage = ({ page }) => {
    router.push({ pathname: '/admin/users' }, { query: { ...query, page } }, { shallow: true });
    getUsers({ ...query, page });
  };

  const lockUser = async (id) => {
    try {
      const confirm = window.confirm('Are you sure lock record?');
      if (!confirm) return;
      const response = await axios.delete(`/admin/users/${id}`);
      const { msg = 'Lock record success.' } = response;
      alert(msg);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers({ ...query, page: pages.current_page });
  }, []);

  return (
    <AdminLayout pageTitle="Users">
      <div className="w-full sm:px-6">
        <div className="p-4 bg-gray-100">
          <div className="sm:flex items-center justify-between">
            <p
              tabIndex={0}
              className="focus:outline-none uppercase text-base sm:text-lg font-bold leading-normal text-gray-800"
            >
              List users
            </p>
          </div>
        </div>
        <div className="bg-white pb-5 overflow-y-auto">
          <p className="font-bold text-xs pt-5 px-4">
            {users.length}/{pages.total || 0} users
          </p>
          {loading ? (
            <div className="flex justify-center items-center h-72">
              <Spinner />
            </div>
          ) : (
            <>
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="w-full text-xs leading-none uppercase font-bold">
                    <th className="p-5 text-left w-60">Name</th>
                    <th className="p-5 text-left w-96">Email</th>
                    <th className="p-5 text-left w-60">Date join</th>
                    <th className="p-5 text-left w-96">Owner of</th>
                  </tr>
                </thead>
                <tbody className="w-full text-xs">
                  {users.map((user) => {
                    return (
                      <tr
                        key={user.id}
                        className="h-16 text-xs leading-none text-gray-800 bg-white border-b border-t border-gray-100"
                      >
                        <td className="cursor-pointer pl-5 py-2">
                          <div>
                            <span className="pr-1">{user.first_name || '---'}</span>
                            <span>{user.last_name || '---'}</span>
                          </div>
                        </td>
                        <td className="cursor-pointer py-2 pl-5">
                          <div className="items-center">
                            <p>{user.email || ' --- '}</p>
                          </div>
                        </td>
                        <td className="cursor-pointer py-2 pl-5">
                          <div>
                            <p className="whitespace-pre-wrap mt-2">
                              {dayjs(user.created_at).format('H:mm:ss MM/DD/YYYY')}
                            </p>
                          </div>
                        </td>
                        {console.log(user.companies)}
                        <td className="cursor-pointer py-2">
                          <div className="flex items-center">
                            {user.companies && user.companies.length > 0
                              ? user.companies?.map((company) => {
                                  return (
                                    <div className="mb-2">
                                      <p>{company.name}</p>
                                      <p className="mt-2">
                                        <a
                                          className="text-blue-300 "
                                          target="_blank"
                                          href={`https://${company?.domain}`}
                                          rel="noreferrer"
                                        >
                                          {company?.domain || '---'}
                                        </a>
                                      </p>
                                    </div>
                                  );
                                })
                              : '	No Company Claimed'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex text-gray-700 mt-4 justify-end">
                <div className="flex flex-col items-center my-5 mx-5">
                  <Paginate
                    currentPage={pages.current_page}
                    lastPage={pages.last_page}
                    changePage={changePage}
                    total={pages.total}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminUsers;
