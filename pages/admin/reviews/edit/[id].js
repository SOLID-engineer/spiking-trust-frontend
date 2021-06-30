import React, { useEffect } from 'react';
import AdminLayout from 'components/admin';
import axios from 'axios';
import { useFormik } from 'formik';
import { getSession } from 'next-auth/client';
import StarRatingInput from 'components/common/StarRatingInput';
import router from 'next/router';

export const getServerSideProps = async (context) => {
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
  return { props: { review_id: id } };
};

export default function AdminReviewEdit({ review_id }) {
  const handleSubmit = async (values) => {
    try {
      const response = await axios.put(`/admin/reviews/${review_id}`, {
        title: values.title,
        content: values.content,
        rating: values.rating,
      });
      router.back();
    } catch (error) {}
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      rating: '',
    },
    onSubmit: handleSubmit,
  });

  const getSetting = async () => {
    const response = await axios.get(`/admin/reviews/${review_id}/edit`);
    const { data } = response;
    formik.setValues({
      title: data.title,
      content: data.content,
      rating: data.rating,
    });
  };

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <AdminLayout pageTitle="Update Reviews">
      <div className="w-3/4 sm:px-6 mx-auto">
        <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto rounded-md">
          <form onSubmit={formik.handleSubmit} className="md:flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Title
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                type="text"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
            </div>
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                Content
              </label>
              <textarea
                name="content"
                className="appearance-none block w-full bg-grey-lighter text-xs text-grey-darker border border-red rounded p-2 mb-3"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.content}
                cols="30"
                rows="10"
              ></textarea>
            </div>

            <div className="w-full px-3 mb-6 md:mb-0">
              <div className="mb-2 font-semibold">Rate your recent experience</div>
              <div className="mb-1">
                <StarRatingInput
                  value={formik.values.rating}
                  onChange={(value) => {
                    formik.setFieldValue('rating', value);
                  }}
                />
              </div>
              {formik.touched.rating && formik.errors.rating ? (
                <div className="text-sm text-red-600">{formik.errors.rating}</div>
              ) : null}
            </div>
            <div className="w-full px-3 flex justify-end items-center pt-10">
              <button type="submit" className="h-10 w-36 font-xs bg-blue-500 text-white">
                Post review
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
