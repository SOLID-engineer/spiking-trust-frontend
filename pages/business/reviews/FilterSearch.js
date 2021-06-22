/* eslint-disable no-nested-ternary */
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';

const FilterSearch = ({ getData }) => {
  const router = useRouter();

  const handleFormSubmit = async (values) => {
    const { page, search, ...rest } = router.query;
    const params = values.search === '' ? rest : { ...rest, search: values.search };
    router.push({ pathname: router.pathname, query: params }, undefined, {
      shallow: true,
    });
    getData(params);
  };

  const formik = useFormik({
    initialValues: { search: router.query.search || '' },
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    formik.setFieldValue('search', router.query.search || '');
  }, [router.query.search]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <input
          autoComplete="off"
          type="text"
          placeholder="Search"
          name="search"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.search}
          className={`border px-3 py-1 text-sm w-48 ${
            router.query.search?.length > 0 ? 'border-blue-600 text-blue-600' : ''
          }`}
        />
      </form>
    </div>
  );
};

export default FilterSearch;
