/* eslint-disable no-use-before-define */
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

import Link from 'next/link';
import Layout from 'components/layout';
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
  const props = {};
  return { props };
};

const ClaimCompany = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      await axios.post('/companies/claim', {
        domain: values.domain,
        email: values.email,
      });
      formik.resetForm();
      setIsSuccess(true);
    } catch (error) {}
  };

  const formik = useFormik({
    initialValues: { domain: '', email: '' },
    validationSchema: Yup.object({
      domain: Yup.string()
        .required('Please enter domain.')
        .matches(
          /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/,
          'The domain is not valid.'
        ),
      email: Yup.string()
        .required('Please enter email address.')
        .matches(/^[a-zA-Z0-9._-]+$/, 'The domain is not valid.'),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Layout>
      <div className="min-h-96">
        <div className="w-full max-w-xl mx-auto my-8">
          <div className="bg-white p-4 shadow">
            {isSuccess ? (
              <div>
                <h1 className="text-3xl font-bold mb-4">We just sent you an email</h1>
                <div className="mb-4">
                  Please check your email. Give it a few minutes, and don’t forget to check your
                  spam folder.
                </div>
                <div>
                  <Link href="/">
                    <a className="px-4 py-2 border bg-indigo-600 text-white border-indigo-600 inline-block">
                      Back to home
                    </a>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-4">Claim a company</h1>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-4">
                    <div className="mb-2 font-semibold">Domain</div>
                    <div className="mb-1">
                      <input
                        className="px-4 py-2 border w-full"
                        name="domain"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.domain}
                      />
                    </div>
                    {formik.touched.domain && formik.errors.domain ? (
                      <div className="text-sm text-red-600">{formik.errors.domain}</div>
                    ) : null}
                  </div>
                  <div className="mb-4">
                    <div className="mb-2 font-semibold">Email</div>
                    <div className="mb-1 flex flex-row border">
                      <input
                        className="px-4 py-2 w-full"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        disabled={!formik.touched.domain || formik.errors.domain}
                      />
                      {formik.touched.domain && !formik.errors.domain && (
                        <div className="px-4 py-2 border-l bg-gray-100">
                          @{formik.values.domain}
                        </div>
                      )}
                    </div>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-sm text-red-600">{formik.errors.email}</div>
                    ) : null}
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="block font-semibold bg-indigo-600 hover:bg-indigo-800 text-white text-center py-3 w-full"
                      disabled={formik.isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClaimCompany;
