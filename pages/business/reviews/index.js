import axios from 'axios';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import BusinessLayout from 'components/business-layout';
import StarRating from 'components/common/StarRating';
import BusinessSelector from 'slices/business/selector';
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

const Reviews = () => {
  const router = useRouter();
  const { page, search = '' } = router.query;
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);

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

  const handleReplySubmit = async (values, formikBag) => {
    const { reviewUuid, content } = values;
    try {
      const response = await axios.post(
        `/business/${currentCompany.domain}/reviews/${reviewUuid}`,
        { content }
      );
      setData({
        ...data,
        items: data.items.map((item) => {
          if (item.uuid === reviewUuid) {
            return { ...item, reply: response.data };
          }
          return item;
        }),
      });
      formikBag.resetForm();
    } catch (error) {}
  };

  const handleDeleteReply = async (reviewUuid) => {
    try {
      await axios.delete(`/business/${currentCompany.domain}/reviews/${reviewUuid}`);
      setData({
        ...data,
        items: data.items.map((item) => {
          if (item.uuid === reviewUuid) {
            return { ...item, reply: null };
          }
          return item;
        }),
      });
    } catch (error) {}
  };

  const replyForm = useFormik({
    initialValues: {
      replyUuid: null,
      reviewUuid: null,
      content: '',
    },
    onSubmit: handleReplySubmit,
  });

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
              {/* <button type="button" className="border px-3 py-1 text-sm">
                Star rating
              </button>
              <button type="button" className="border px-3 py-1 text-sm">
                Reply
              </button>
              <button type="button" className="border px-3 py-1 text-sm">
                Date
              </button> */}
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
                <div key={item.id} className="">
                  <div className="bg-white p-4 flex flex-row space-x-4">
                    <div className="flex-none w-44">
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
                  <div className="bg-white px-4 py-2 flex flex-row space-x-4 border-t">
                    <div className="flex-none w-44"></div>
                    <div className="w-auto flex-grow">
                      {item.reply !== null ? (
                        <button
                          type="button"
                          className="border px-3 py-1 bg-white text-sm"
                          onClick={() => {
                            setCurrentReview(item);
                          }}
                        >
                          Replied
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="border px-3 py-1 bg-white text-sm"
                          onClick={() => {
                            setCurrentReview(null);
                            replyForm.setValues({ reviewUuid: item.uuid, content: '' });
                          }}
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                  {item.reply !== null && currentReview === item && (
                    <div className="bg-gray-50 px-4 py-4 flex flex-row space-x-4 border-t">
                      <div className="flex-none w-44">
                        {currentCompany.name || currentCompany.domain}
                      </div>
                      <div className="w-auto flex-grow">
                        <div className="mb-2 text-sm">{item.reply.content}</div>
                        <div className="space-x-2">
                          {/* <button
                            type="button"
                            className="border px-3 py-1 text-sm bg-white"
                            onClick={() => {
                              setCurrentReview(null);
                              replyForm.setValues({
                                reviewUuid: item.uuid,
                                replyUuid: item.reply.uuid,
                                content: '',
                              });
                            }}
                          >
                            Edit reply
                          </button> */}
                          <button
                            type="button"
                            className="border px-3 py-1 text-sm bg-white text-red-600 border-red-600"
                            onClick={() => handleDeleteReply(item.uuid)}
                          >
                            Delete reply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {replyForm.values.reviewUuid === item.uuid && (
                    <div className="bg-gray-50 px-4 py-4 flex flex-row space-x-4 border-t">
                      <div className="flex-none w-44">
                        {currentCompany.name || currentCompany.domain}
                      </div>
                      <div className="w-auto flex-grow">
                        <form onSubmit={replyForm.handleSubmit}>
                          <div className="mb-2">
                            <textarea
                              className="border p-2 w-full resize-none"
                              rows={4}
                              name="content"
                              onChange={replyForm.handleChange}
                              onBlur={replyForm.handleBlur}
                              value={replyForm.values.content}
                            />
                          </div>
                          <div>
                            <button
                              type="submit"
                              className="border px-3 py-1 text-sm bg-indigo-600 text-white border-indigo-600"
                            >
                              Post reply
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
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

export default Reviews;
