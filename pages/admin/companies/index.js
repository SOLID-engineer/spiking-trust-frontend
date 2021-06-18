import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/admin';
import Link from 'next/link';

import axios from 'axios';
import EditIcon from 'components/icons/edit';
import TrashIcon from 'components/icons/trash';

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

const CompanyAdmin = () => {
  const [companies, setCompanies] = useState([]);

  const getCompanies = async () => {
    const response = await axios.get('/admin/companies', {});
    const { data = [] } = response;
    setCompanies(data.items);
  };

  const removeRecord = async (id) => {
    try {
      const confirm = window.confirm('Are you sure delete record?');
      if (!confirm) return;
      const response = await axios.delete(`/admin/categories/${id}`);
      const { msg = 'Deleted record success.' } = response;
      alert(msg);
      getCategories();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  console.log();

  return (
    <AdminLayout pageTitle="Companies">
      <div className="w-full sm:px-6">
        <div className="px-4 md:px-10 py-4 md:py-5 bg-gray-100  rounded-tl-md rounded-tr-md">
          <div className="sm:flex items-center justify-between">
            <p
              tabIndex={0}
              className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-xl font-bold leading-normal text-gray-800"
            >
              List companies
            </p>
          </div>
        </div>
        <div className="bg-white shadow md:px-6 pt-4 md:pt-7 pb-5 overflow-y-auto rounded-bl-md rounded-br-md">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-200 text-gray-600 w-full text-sm leading-none uppercase font-bold">
                <th className="p-5 text-left">Url</th>
                <th className="p-5 text-left">Claimed At</th>
                <th className="p-5 text-left">Created At</th>
                <th className="p-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {companies.map((company) => {
                return (
                  <tr
                    key={company.id}
                    className="h-20 text-sm leading-none text-gray-800 bg-white border-b border-t border-gray-100"
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
                        <p className="pl-5">{company.claimed_at || ' --- '}</p>
                        <p className="pl-5">{company.claimed_by || ' --- '}</p>
                      </div>
                    </td>
                    <td className="cursor-pointer">
                      <div className="flex items-center">
                        <div className="pl-5">{company.created_at}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex ml-5">
                        <Link href={`/admin/categories/edit/${company.id}`}>
                          <p
                            className="btn btn-sm btn-clean btn-icon mr-2 h-6 w-6"
                            title="Edit details"
                          >
                            <span className="text-sm">
                              <EditIcon />
                            </span>
                          </p>
                        </Link>
                        <button
                          className="btn btn-sm btn-clean btn-icon mr-2  h-6 w-6"
                          title="Detele details"
                          onClick={() => removeRecord(company.id)}
                        >
                          <span className="text-sm text-red-400">
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
        </div>
      </div>
    </AdminLayout>
  );
};
export default CompanyAdmin;
