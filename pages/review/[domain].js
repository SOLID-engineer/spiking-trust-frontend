import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import StarRating from '../../components/common/StarRating';
import StarRatingInput from '../../components/common/StarRatingInput';
import Layout from '../../components/layout';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export async function getServerSideProps(context) {
  const { domain } = context.params;
  const { page = 1 } = context.query;
  const props = {};
  try {
    let response = await axios.get(`/companies/${domain}`);
    props.company = response.data;
    response = await axios.get(`/companies/${domain}/reviews`, { params: { page } });
    props.data = response.data;
    if (response.data.items.length === 0 && page !== 1) {
      return {
        redirect: {
          destination: `/review/${domain}`,
          permanent: false,
        },
      };
    }
  } catch (error) {}
  return { props };
}

const Review = ({ company, data }) => {
  const router = useRouter();
  const [reviews, setReviews] = useState(data.items);
  const [currentPage, setCurrentPage] = useState(data.current_page);
  const [lastPage, setLastPage] = useState(data.last_page);

  const getReviews = async (page) => {
    try {
      const response = await axios.get(`/companies/${company.domain}/reviews`, {
        params: { page },
      });
      setReviews(response.data.items);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {}
  };

  const handleNextPage = async () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: currentPage + 1 } },
      undefined,
      { shallow: true }
    );
    await getReviews(currentPage + 1);
  };

  const handlePreviousPage = async () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: currentPage - 1 } },
      undefined,
      { shallow: true }
    );
    await getReviews(currentPage - 1);
  };

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
      <div className="min-h-96">
        <div className="w-full max-w-6xl mx-auto flex flex-row flex-wrap items-start">
          <div className="grid grid-cols-3 gap-8 w-full mb-8">
            <div className="col-span-2">
              <div className="bg-white p-4 mb-4 flex flex-row items-center justify-between">
                <Link href={`/evaluate/${company.domain}`}>
                  <a className="text-blue-600">Write a review</a>
                </Link>
                <StarRatingInput
                  value={0}
                  onChange={(value) => {
                    router.push({
                      pathname: `/evaluate/${company.domain}`,
                      query: { star: value },
                    });
                  }}
                />
              </div>

              <div className="mb-4">
                {reviews.map((review) => (
                  <div className="bg-white p-4 mb-2" key={review.id}>
                    <div className="pb-4 border-b">
                      <span className="font-semibold">
                        {review.author.first_name} {review.author.last_name}
                      </span>
                    </div>
                    <div className="py-4">
                      <div className="flex flex-row items-center justify-between mb-4">
                        <StarRating value={review.rating} size="md" />
                        <span className="text-gray-400">
                          {dayjs().to(dayjs(review.updated_at))}
                        </span>
                      </div>
                      <div className="mb-2 font-semibold text-lg">{review.title}</div>
                      <div>{review.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              {reviews.length > 0 && (
                <div className="flex flex-row justify-center space-x-2">
                  {currentPage > 1 && (
                    <button
                      type="button"
                      className="text-center font-semibold px-4 py-2 border bg-white"
                      onClick={handlePreviousPage}
                    >
                      Previous page
                    </button>
                  )}
                  {currentPage < lastPage && (
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
            <div className="space-y-4">
              {company.description && (
                <div className="bg-white p-4">
                  <div className="mb-2 text-lg font-semibold">
                    About {company.name || company.domain}
                  </div>
                  <div>{company.description}</div>
                </div>
              )}
              <div className="bg-white p-4">
                <div className="mb-2 text-lg font-semibold">Is this your company?</div>
                <div>
                  <Link href="/claim-company">
                    <a className="px-4 py-2 border bg-indigo-600 text-white border-indigo-600 inline-block">
                      Claim a company
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Review;
