import React, { useEffect, useState } from 'react';

import AdminLayout from 'components/admin';
import PrivateRoute from 'components/routes/PrivateRoute';
import Link from 'next/link';

import SessionSelector from 'slices/session/selector';
import { wrapper } from 'slices/store';
import axios from 'axios';
import EditIcon from 'components/icons/edit';
import TrashIcon from 'components/icons/trash';

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
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const response = await axios.get('/admin/categories', {});
    const { data = [] } = response;
    setCategories(data);
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
    getCategories();
  }, []);

  console.log('categories', categories);

  return (
    <AdminLayout pageTitle="Categories">
      <div className="w-full sm:px-6">
        <div className="px-4 md:px-10 py-4 md:py-5 bg-gray-100  rounded-tl-md rounded-tr-md">
          <div className="sm:flex items-center justify-between">
            <p
              tabIndex={0}
              className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-xl font-bold leading-normal text-gray-800"
            >
              Projects
            </p>
            <div>
              <button className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 inline-flex sm:ml-3 mt-4 sm:mt-0 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
                <Link href="/admin/categories/edit">
                  <p className="text-sm font-medium leading-none text-white">New category</p>
                </Link>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto rounded-bl-md rounded-br-md">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="h-16 w-full text-sm leading-none text-gray-800">
                <th className="font-normal text-left">Name</th>
                <th className="font-normal text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {categories.map((category) => {
                return (
                  <tr
                    key={category.id}
                    className="h-20 text-sm leading-none text-gray-800 bg-white border-b border-t border-gray-100"
                  >
                    <td className="cursor-pointer">
                      <div className="flex items-center">
                        <div className="pl-5">
                          <p
                            className={`font-medium pl-${
                              category.level >= 3 ? '20' : category.level >= 2 ? '10' : ''
                            }`}
                          >
                            {category.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex">
                        <Link href={`/admin/categories/edit/${category.id}`}>
                          <p
                            className="btn btn-sm btn-clean btn-icon mr-2 h-6 w-6"
                            title="Edit details"
                          >
                            <span className="text-sm text-gray-300">
                              <EditIcon />
                            </span>
                          </p>
                        </Link>
                        <button
                          className="btn btn-sm btn-clean btn-icon mr-2  h-6 w-6"
                          title="Detele details"
                          onClick={() => removeRecord(category.id)}
                        >
                          <span className="text-sm text-gray-300">
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

export default PrivateRoute(Business);
