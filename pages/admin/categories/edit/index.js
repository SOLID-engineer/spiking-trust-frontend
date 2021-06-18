import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/admin';
import axios from 'axios';
import { useFormik } from 'formik';
import router from 'next/router';

export default function Create() {
  const [categories, setCategories] = useState([]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('/admin/categories', {
        parent_id: values.parent_id,
        status: 1,
        name: values.name,
      });
      const { data } = response;

      router.push({ pathname: '/admin/categories' }, undefined, { shallow: true });
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      parent_id: '0',
    },
    onSubmit: handleSubmit,
  });

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
  }, []);

  return (
    <AdminLayout pageTitle="Create categories">
      <div className="w-full sm:px-6">
        <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto rounded-md">
          <form onSubmit={formik.handleSubmit} className="md:flex flex-wrap -mx-3 mb-6">
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
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
            <div className="md:w-1/2 px-3">
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
