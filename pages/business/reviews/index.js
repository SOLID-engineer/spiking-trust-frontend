import axios from 'axios';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessLayout from 'components/business-layout';
import StarRating from 'components/common/StarRating';
import BusinessSelector from 'slices/business/selector';
import { getSession } from 'next-auth/client';
import Spinner from 'components/common/Spinner';

import withCompany from 'components/hocs/withCompany';
import FilterStars from 'components/business/reviews/FilterStars';
import FilterReply from 'components/business/reviews/FilterReply';
import FilterSearch from 'components/business/reviews/FilterSearch';

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
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  const getData = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/business/${currentCompany.domain}/reviews`, { params });
      setData(response.data);
    } catch (error) {}
    setIsLoading(false);
  });

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
    if (currentCompany !== null) getData(router.query);
  }, [currentCompany]);

  return (
    <BusinessLayout
      pageTitle="Reviews"
      headerBottom={
        <>
          <div className="border-t px-6 py-2 flex flex-row flex-wrap gap-2 pr-64">
            <FilterSearch getData={getData}></FilterSearch>
            <FilterStars getData={getData} />
            <FilterReply getData={getData} />
            {/* <button type="button" className="border px-3 py-1 text-sm">
                Date
              </button> */}
            {(router.query.search || router.query.stars || router.query.reply) && (
              <button
                type="button"
                className="px-3 py-1 text-sm"
                onClick={() => {
                  router.push({ pathname: router.pathname }, undefined, { shallow: true });
                  getData(null);
                }}
              >
                Clear all
              </button>
            )}
          </div>
        </>
      }
    >
      <div className="w-full max-w-3xl mx-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-24">
            <Spinner />
          </div>
        )}
        {!isLoading && (
          <>
            {data?.items !== undefined && data.items.length > 0 && (
              <div>
                {(router.query.search || router.query.stars || router.query.reply) && (
                  <div className="flex flex-row justify-between items-center mb-4">
                    <div className="font-semibold">{data.total} matches found</div>
                    <div className="text-sm">
                      Showing {data.items.length} of {data.total}
                    </div>
                  </div>
                )}
                <div className="space-y-2 mb-4">
                  {data.items.map((item) => (
                    <div key={item.id} className="">
                      <div className="bg-white p-4 flex flex-row flex-wrap lg:flex-nowrap gap-4">
                        <div className="flex-none w-full lg:w-44">
                          <div className="mb-2">
                            <StarRating value={item.rating} size="md" />
                          </div>
                          <div>
                            {item.author.first_name} {item.author.last_name}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-row justify-between items-baseline">
                            <div className="font-semibold mb-2">{item.title}</div>
                            <div className="text-sm text-right w-48">
                              {dayjs(item.created_at).format('MMM D, YYYY')}
                            </div>
                          </div>
                          <div>{item.content}</div>
                        </div>
                      </div>
                      <div className="bg-white px-4 py-2 flex flex-row gap-4 border-t">
                        <div className="flex-none hidden lg:block lg:w-44"></div>
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
                        <div className="bg-gray-50 px-4 py-4 flex flex-row flex-wrap lg:flex-nowrap gap-4 border-t">
                          <div className="flex-none w-full lg:w-44">
                            {currentCompany.name || currentCompany.domain}
                          </div>
                          <div className="flex-grow">
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
                        <div className="bg-gray-50 px-4 py-4 flex flex-row flex-wrap lg:flex-nowrap gap-4 border-t">
                          <div className="flex-none w-full lg:w-44">
                            {currentCompany.name || currentCompany.domain}
                          </div>
                          <div className="flex-grow">
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
            {(router.query.search || router.query.stars || router.query.reply) &&
              data?.items !== undefined &&
              data.items.length === 0 && (
                <div className="bg-white border p-4">
                  <div className="font-semibold mb-2">We couldn’t find any matches.</div>
                  <div className="font-semibold mb-4">Things you can try:</div>
                  <ul className="list-disc list-inside">
                    <li>Check that all words are spelled correctly</li>
                    <li>Clear the filter settings</li>
                    <li>Search for different keywords</li>
                    <li>Search for more general keywords</li>
                  </ul>
                </div>
              )}
          </>
        )}
      </div>
    </BusinessLayout>
  );
};

export default withCompany(Reviews);
