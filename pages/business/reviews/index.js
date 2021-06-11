import axios from 'axios';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessLayout from '../../../components/business-layout';
import StarRating from '../../../components/common/StarRating';
import PrivateRoute from '../../../components/routes/PrivateRoute';
import BusinessSelector from '../../../slices/business/selector';

import SessionSelector from '../../../slices/session/selector';
import { wrapper } from '../../../slices/store';

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

const Reviews = () => {
  const router = useRouter();
  const { page, search = '' } = router.query;
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const getData = async (params) => {
    try {
      const response = await axios.get(`/business/${currentCompany.domain}/reviews`, {
        params,
      });
      setData(response.data);
    } catch (error) {}
  };

  const handleSubmit = (values) => {
    router.push(
      {
        pathname: router.pathname,
        query: { search: values.search },
      },
      undefined,
      { shallow: true }
    );
    getData({ search: values.search });
  };

  const formik = useFormik({
    initialValues: {
      search,
    },
    onSubmit: handleSubmit,
  });

  const handleNextPage = async () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: data.current_page + 1 } },
      undefined,
      { shallow: true }
    );
    await getData({ page: data.current_page + 1 });
  };

  const handlePreviousPage = async () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: data.current_page - 1 } },
      undefined,
      { shallow: true }
    );
    await getData({ page: data.current_page - 1 });
  };

  useEffect(() => {
    if (currentCompany !== null) getData({ page, search });
  }, [currentCompany]);

  return (
    <BusinessLayout
      pageTitle="Reviews"
      headerBottom={
        <>
          <form onSubmit={formik.handleSubmit}>
            <div className="border-t px-6 py-2 flex flex-row space-x-3">
              <input
                type="text"
                placeholder="Search"
                className="border px-3 py-1 text-sm w-48"
                name="search"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.search}
              />
              <button type="button" className="border px-3 py-1 text-sm">
                Star rating
              </button>
              <button type="button" className="border px-3 py-1 text-sm">
                Reply
              </button>
              <button type="button" className="border px-3 py-1 text-sm">
                Date
              </button>
            </div>
          </form>
        </>
      }
    >
      <div className="w-full max-w-3xl mx-auto">
        {data?.items !== undefined && data.items.length > 0 && (
          <div>
            {/* <div className="font-semibold mb-2">{data.total} matches found</div> */}
            <div className="space-y-2 mb-4">
              {data.items.map((item) => (
                <div key={item.id} className="bg-white border p-4 flex flex-row space-x-8">
                  <div>
                    <div className="mb-2">
                      <StarRating value={item.rating} size="md" />
                    </div>
                    <div>
                      {item.author.first_name} {item.author.last_name}
                    </div>
                  </div>
                  <div className="w-auto flex-grow">
                    <div className="flex flex-row justify-between items-baseline">
                      <div className="font-semibold mb-2">{item.title}</div>
                      <div className="text-sm text-right w-48">
                        {dayjs(item.created_at).format('MMM D, YYYY')}
                      </div>
                    </div>
                    <div>{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
            {data !== null && (
              <div className="flex flex-row justify-center space-x-2">
                {data.current_page > 1 && (
                  <button
                    type="button"
                    className="text-center font-semibold px-4 py-2 border bg-white"
                    onClick={handlePreviousPage}
                  >
                    Previous page
                  </button>
                )}
                {data.current_page < data.last_page && (
                  <button
                    type="button"
                    className="text-center text-white font-semibold bg-indigo-600 px-4 py-2 border bg-indigo-600"
                    onClick={handleNextPage}
                  >
                    Next page
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </BusinessLayout>
  );
};

export default PrivateRoute(Reviews);
