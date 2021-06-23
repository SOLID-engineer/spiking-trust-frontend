import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/admin';

import { getSession } from 'next-auth/client';
import Link from 'next/link';
import axios from 'axios';
import EditIcon from 'components/icons/edit';
import TrashIcon from 'components/icons/trash';
import Paginate from 'components/admin/paginate';

export async function getServerSideProps(context) {
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
}

export default function Edit({ ...props }) {
  const [templates, setTemplates] = useState([]);
  const [pages, setPages] = useState([]);

  const getTemplates = async () => {
    const response = await axios.get('/admin/mail-templates', {});
    const { data = [] } = response;
    setTemplates(data.items);
    setPages({
      current_page: data.current_page,
      last_page: data.last_page,
      total: data.total,
      per_page: data.per_page,
    });
  };

  const removeRecord = async (id) => {
    try {
      const confirm = window.confirm('Are you sure delete record?');
      if (!confirm) return;
      const response = await axios.delete(`/admin/mail-templates/${id}`);
      const { msg = 'Deleted record success.' } = response;
      alert(msg);
      getTemplates();
    } catch (error) {
      console.log(error);
    }
  };

  const changePage = () => {
    getTemplates({ page: pages.current_page + 1 });
  };

  useEffect(() => {
    getTemplates();
  }, []);

  return (
    <AdminLayout pageTitle="Mail Templates">
      <div className="w-full sm:px-6">
        <div className="p-4 bg-gray-100">
          <div className="sm:flex items-center justify-between">
            <p
              tabIndex={0}
              className="focus:outline-none uppercase text-base sm:text-lg font-bold leading-normal text-gray-800"
            >
              Templates
            </p>
            <div>
              <button className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 inline-flex sm:ml-3 mt-4 sm:mt-0 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
                <Link href="/admin/mail-templates/edit">
                  <p className="text-sm font-medium leading-none text-white">New templates</p>
                </Link>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white pb-5 overflow-y-auto">
          <p className="font-bold text-xs pt-5 px-4">
            {templates.length}/{pages.total || 0} templates
          </p>
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="w-full text-xs leading-none uppercase font-bold">
                <th className="p-5 text-left">Name</th>
                <th className="p-5 text-left">Title</th>
                <th className="p-5 text-left">Type</th>
                <th className="p-5 text-left w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {templates.map((template) => {
                return (
                  <tr
                    key={template.id}
                    className="h-20 text-xs leading-none text-gray-800 bg-white border-b border-t border-gray-100"
                  >
                    <td className="cursor-pointer">
                      <div className="flex items-center">
                        <div className="pl-5">{template.name}</div>
                      </div>
                    </td>
                    <td className="cursor-pointer">
                      <div className="flex items-center">
                        <div className="pl-5">{template.title}</div>
                      </div>
                    </td>
                    <td className="cursor-pointer">
                      <div className="flex items-center">
                        <div className="pl-5">{template.type}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex pl-5">
                        <Link href={`/admin/mail-templates/edit/${template.id}`}>
                          <p
                            className="btn btn-sm btn-clean btn-icon mr-2 h-6 w-6 cursor-pointer"
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
                          onClick={() => removeRecord(template.id)}
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
                onClick={changePage}
                total={pages.total}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
