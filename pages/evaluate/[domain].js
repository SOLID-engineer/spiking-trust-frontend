/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getSession } from 'next-auth/client';

import Layout from 'components/layout';
import StarRating from 'components/common/StarRating';
import StarRatingInput from 'components/common/StarRatingInput';

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
  const { domain } = context.params;
  const { star } = context.query;
  const props = {};
  props.initialRating = star || 0;
  try {
    const response = await axios.get(`/companies/${domain}`);
    props.company = response.data;
  } catch (error) {}
  return { props };
};

const Evaluate = ({ company, initialRating }) => {
  const router = useRouter();

  if (!company) return null;

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`/evaluate/${company.domain}`, values);
      router.push(`/review/${company.domain}`);
    } catch (error) {}
  };

  const formik = useFormik({
    initialValues: {
      rating: initialRating,
      title: '',
      content: '',
    },
    validationSchema: Yup.object({
      rating: Yup.number().required('Please rate.').min(1, 'Please rate.').max(5, 'Please rate.'),
      title: Yup.string()
        .required('Please write a title with more than 3 characters.')
        .min(3, 'Please write a title with more than 3 characters.'),
      content: Yup.string()
        .required('Please write a review with more than 10 characters.')
        .min(10, 'Please write a review with more than 10 characters.'),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Layout>
      <div className="bg-white shadow mb-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8 py-6">
            <div className="col-span-2">
              <h1 className="text-3xl font-bold mb-2">{company.name || company.domain}</h1>
              <div className="mb-2">Reviews {company.reviews_count}</div>
              <div className="flex flex-row space-x-4 items-center">
                <StarRating value={company.average_rating} />
                <div>{parseFloat(company.average_rating).toFixed(1)}</div>
              </div>
            </div>
            <div>
              <a
                className="py-3 px-6 border block"
                href={`//${company.domain}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className="font-semibold">{company.domain}</div>
                <div>Visit this website</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-row justify-center">
          <div className="bg-white lg:w-1/2 shadow mb-4 p-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
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
              <div className="mb-4">
                <div className="mb-2 font-semibold">Tell us about your experience</div>
                <div>
                  <textarea
                    rows={8}
                    className="px-4 py-2 border w-full resize-none"
                    placeholder="This is where you write your review. Explain what happened, and leave out offensive words. Keep your feedback honest, helpful, and constructive."
                    name="content"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.content}
                  ></textarea>
                </div>
                {formik.touched.content && formik.errors.content ? (
                  <div className="text-sm text-red-600">{formik.errors.content}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <div className="mb-2 font-semibold">Give your review a title</div>
                <div className="mb-1">
                  <input
                    className="px-4 py-2 border w-full"
                    placeholder="Write the title of your review here."
                    name="title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                  />
                </div>
                {formik.touched.title && formik.errors.title ? (
                  <div className="text-sm text-red-600">{formik.errors.title}</div>
                ) : null}
              </div>
              <div>
                <button
                  type="submit"
                  className="block font-semibold bg-indigo-600 hover:bg-indigo-800 text-white text-center py-3 w-full"
                  disabled={formik.isSubmitting}
                >
                  Post review
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Evaluate;
