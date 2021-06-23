import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/admin';
import axios from 'axios';
import { useFormik } from 'formik';
import router from 'next/router';
import { getSession } from 'next-auth/client';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { id } = context.params;
  if (!session) {
    return {
      redirect: {
        destination: `/login?returnUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  return { props: { category_id: id } };
}

export default function Edit({ category_id }) {
  const [categories, setCategories] = useState([]);
  const handleSubmit = async (values) => {
    try {
      const response = await axios.put(`/admin/categories/${category_id}`, {
        parent_id: values.parent_id,
        status: 1,
        name: values.name,
      });
      const { data } = response;
      if (data);
      router.push({ pathname: '/admin/categories' }, undefined, { shallow: true });
    } catch (error) {}
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      parent_id: '0',
    },
    onSubmit: handleSubmit,
  });

  const getCategory = async () => {
    const response = await axios.get(`/admin/categories/${category_id}/edit`);
    const { data } = response;
    formik.setValues({
      name: data.name,
      parent_id: data.parent_id,
    });
  };

  const getCategories = async () => {
    const response = await axios.get('/admin/categories', {
      params: {
        level: 2,
      },
    });
    const { data = [] } = response;
    setCategories(data);
  };

  useEffect(() => {
    getCategories();
    getCategory();
  }, []);

  return (
    <AdminLayout pageTitle="Create categories">
      <div className="md:w-2/3 mx-auto sm:px-6">
        <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto rounded-md">
          <form onSubmit={formik.handleSubmit} className="md:flex flex-wrap -mx-3 mb-6">
            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Name category
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>
            <div className="md:w-full px-3">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Parent Category
              </label>
              <div className="relative">
                <select
                  name="parent_id"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.parent_id}
                  className="block appearance-none w-full bg-grey-lighter text-xs border border-grey-lighter text-grey-darker p-2 pr-8 rounded"
                >
                  <option value="0">Select parent category...</option>
                  {categories.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.level >= 2 ? '---' : ''} {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="md:w-full px-3 flex justify-end items-center pt-10">
              <button
                type="submit"
                className="h-10 w-36 rounded font-medium bg-blue-500 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
