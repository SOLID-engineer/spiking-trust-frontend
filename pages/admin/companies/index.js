import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/admin';
import Link from 'next/link';

import axios from 'axios';
import EditIcon from 'components/icons/edit';
import TrashIcon from 'components/icons/trash';

import { getSession } from 'next-auth/client';
import Paginate from 'components/admin/paginate';
import router from 'next/router';
import dayjs from 'dayjs';

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

const CompanyAdmin = ({ query }) => {
  const [companies, setCompanies] = useState([]);
  const [pages, setPages] = useState({
    current_page: query?.page || 1,
    last_page: 0,
    total: 0,
    per_page: 20,
  });

  const getCompanies = async (params) => {
    const response = await axios.get('/admin/companies', { params });
    const { data = [] } = response;
    setCompanies(data.items);
    setPages({
      current_page: data.current_page,
      last_page: data.last_page,
      total: data.total,
      per_page: data.per_page,
    });
  };

  const changePage = ({ page }) => {
    router.push({ pathname: '/admin/companies' }, { query: { ...query, page } }, { shallow: true });
    getCompanies({ ...query, page });
  };

  useEffect(() => {
    getCompanies({ ...query, page: pages.current_page });
  }, []);

  return (
    <AdminLayout pageTitle="Companies">
      <div className="w-full sm:px-6">
        <div className="px-4 py-4 md:py-5 bg-gray-100">
          <div className="sm:flex items-center justify-between">
            <p
              tabIndex={0}
              className="focus:outline-none uppercase text-base sm:text-lg font-bold leading-normal text-gray-800"
            >
              List companies
            </p>
          </div>
        </div>
        <div className="bg-white pb-5 overflow-y-auto">
          <p className="font-bold text-xs pt-5 px-4">
            {companies.length}/{pages.total || 0} companies
          </p>
          <table className="w-full whitespace-nowrap my-4">
            <thead>
              <tr className="w-full text-xs leading-none uppercase font-bold">
                <th className="p-5 text-left">Url</th>
                <th className="p-5 text-left">Claimed At</th>
                <th className="p-5 text-left">Created At</th>
                <th className="p-5 text-left w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {companies.map((company) => {
                return (
                  <tr
                    key={company.id}
                    className="h-20 text-xs leading-none text-gray-800 bg-white border-b border-t border-gray-100"
                  >
                    <td className="cursor-pointer">
                      <div className="items-center">
                        <span className="pl-5 py-3">{company.name}</span>
                        <p className="pl-5 py-3">
                          {company.domain} |
                          <a
                            className="text-blue-300 px-3"
                            target="_blank"
                            href={`https://${company.domain}`}
                            rel="noreferrer"
                          >
                            View website
                          </a>
                        </p>
                      </div>
                    </td>
                    <td className="cursor-pointer">
                      <div className="items-center">
                        <p className="pl-5">
                          {company.claimed_at
                            ? dayjs(company.claimed_at).format('H:m:ss MM/DD/YYYY')
                            : ' --- '}
                        </p>
                      </div>
                    </td>
                    <td className="cursor-pointer">
                      <div className="flex items-center">
                        <div className="pl-5">
                          {dayjs(company.created_at).format('H:m:ss MM/DD/YYYY') || ' --- '}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex ml-5">
                        <Link href={`/admin/categories/edit/${company.id}`}>
                          <p
                            className="btn btn-sm btn-clean btn-icon mr-2 h-6 w-6"
                            title="Edit details"
                          >
                            <span className="text-xs">
                              <EditIcon />
                            </span>
                          </p>
                        </Link>
                        <button
                          className="btn btn-sm btn-clean btn-icon mr-2  h-6 w-6"
                          title="Detele details"
                          onClick={() => removeRecord(company.id)}
                        >
                          <span className="text-xs text-red-400">
                            <TrashIcon />
                          </span>
                        </button>
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
        </div>
      </div>
    </AdminLayout>
  );
};
export default CompanyAdmin;
