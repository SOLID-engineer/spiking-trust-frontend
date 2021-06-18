import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { isEmpty } from 'lodash';
import StarRating from '../../components/common/StarRating';
import StarRatingInput from '../../components/common/StarRatingInput';
import Layout from '../../components/layout';
import PercentageBar from './PercentageBar';
import InputSearch from './InputSearch';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export async function getServerSideProps(context) {
  const { domain } = context.params;
  const props = {};
  try {
    let response = await axios.get(`/companies/${domain}`);
    props.company = response.data;

    response = await axios.get(`/companies/${domain}/reviews`, { params: context.query });

    props.data = response.data;
    const { page = 1 } = context.query;
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
  const [companyRate, setCompanyRate] = useState([]);
  const [lastPage, setLastPage] = useState(data.last_page);
  const [currentPage, setCurrentPage] = useState(data.current_page);

  const { stars: filterStars = [] } = router.query;

  const getReviewsRates = async () => {
    try {
      const response = await axios.get(`/companies/${company.uuid}/info`);
      setCompanyRate(response?.data?.stars);
    } catch (error) {}
  };

  useEffect(() => {
    getReviewsRates();
  }, []);

  const getReviews = async (params) => {
    try {
      const response = await axios.get(`/companies/${company.domain}/reviews`, {
        params,
      });
      setReviews(response.data.items);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {}
  };

  const filterStarHandler = (star) => {
    const { stars = [], page, ...rest } = router.query;
    let newList;
    if (isEmpty(stars)) newList = star;
    else if (stars.includes(star)) {
      if (typeof stars === 'string') newList = null;
      else newList = stars.filter((value) => value !== star);
    } else if (typeof stars === 'string') newList = [stars, star];
    else newList = [...stars, star];
    router.push(
      { pathname: router.pathname, query: newList === null ? rest : { ...rest, stars: newList } },
      undefined,
      {
        shallow: true,
      }
    );
    getReviews({ ...rest, stars: newList });
  };

  const searchHandler = (params) => {
    const { search, page, ...rest } = router.query;
    if (params?.search) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...rest, search: params.search },
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push({ pathname: router.pathname, query: rest }, undefined, {
        shallow: true,
      });
    }
    getReviews({ ...rest, search: params.search });
  };

  const handleNextPage = async () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: currentPage + 1 } },
      undefined,
      { shallow: true }
    );
    await getReviews({ ...router.query, page: currentPage + 1 });
  };

  const handlePreviousPage = async () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: currentPage - 1 } },
      undefined,
      { shallow: true }
    );
    await getReviews({ ...router.query, page: currentPage - 1 });
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
                <div className="bg-white p-4 mb-2">
                  <div className="pb-4 border-b">
                    <span className="font-semibold space-x-2 text-lg">
                      <span className="font-bold ">Reviews</span>
                      <span className="text-gray-400">{company.reviews_count}</span>
                    </span>
                  </div>
                  <div className="py-4">
                    <div className="flex flex-row items-center justify-between mb-2">
                      <div className="flex flex-none flex-row items-center space-x-2 w-28">
                        <input
                          onChange={() => filterStarHandler('5')}
                          defaultChecked={filterStars.includes('5')}
                          type="checkbox"
                        />
                        <span>Excellent</span>
                      </div>
                      <PercentageBar
                        barColor="#00b67a"
                        activePercentage={companyRate['5'] / company.reviews_count}
                        active={filterStars.includes('5')}
                      />
                      <div className="flex-none text-right text-gray-400 w-16"> 77% </div>
                    </div>
                    <div className="flex flex-row items-center justify-between mb-2">
                      <div className="flex flex-none flex-row items-center space-x-2 w-28">
                        <input
                          onChange={() => filterStarHandler('4')}
                          defaultChecked={filterStars.includes('4')}
                          type="checkbox"
                        />
                        <span>Great</span>
                      </div>
                      <PercentageBar
                        barColor="#73cf11"
                        activePercentage={companyRate['4'] / company.reviews_count}
                        active={filterStars.includes('4')}
                      />
                      <div className="flex-none text-right text-gray-400 w-16"> 9% </div>
                    </div>
                    <div className="flex flex-row items-center justify-between mb-2">
                      <div className="flex flex-none flex-row items-center space-x-2 w-28">
                        <input
                          onChange={() => filterStarHandler('3')}
                          defaultChecked={filterStars.includes('3')}
                          type="checkbox"
                        />
                        <span>Average</span>
                      </div>
                      <PercentageBar
                        barColor="#ffce00"
                        activePercentage={companyRate['3'] / company.reviews_count}
                        active={filterStars.includes('3')}
                      />
                      <div className="flex-none text-right text-gray-400 w-16"> 3% </div>
                    </div>
                    <div className="flex flex-row items-center justify-between mb-2">
                      <div className="flex flex-none flex-row items-center space-x-2 w-28">
                        <input
                          onChange={() => filterStarHandler('2')}
                          defaultChecked={filterStars.includes('2')}
                          type="checkbox"
                        />
                        <span>Poor</span>
                      </div>
                      <PercentageBar
                        barColor="#ff8622"
                        activePercentage={companyRate['2'] / company.reviews_count}
                        active={filterStars.includes('2')}
                      />
                      <div className="flex-none text-right text-gray-400 w-16"> 2% </div>
                    </div>
                    <div className="flex flex-row items-center justify-between mb-2">
                      <div className="flex flex-none flex-row items-center space-x-2 w-28">
                        <input
                          onChange={() => filterStarHandler('1')}
                          defaultChecked={filterStars.includes('1')}
                          type="checkbox"
                        />
                        <span>Bad</span>
                      </div>
                      <PercentageBar
                        barColor="#ff3722"
                        activePercentage={companyRate['1'] / company.reviews_count}
                        active={filterStars.includes('1')}
                      />
                      <div className="flex-none text-right text-gray-400 w-16"> 9% </div>
                    </div>
                  </div>
                  <InputSearch getReviews={searchHandler} />
                </div>
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
              {reviews.length < 1 &&
                (router.query.search !== undefined || router.query.stars !== undefined) && (
                  <div>No reviews matching your search.</div>
                )}
            </div>
            <div className="space-y-4">
              {company.claimed_at !== null && (
                <div className="bg-white p-4">
                  <div className="mb-2 text-lg font-semibold">Business Transparency</div>
                  <div>Claimed their profile: {dayjs(company.claimed_at).format('MMMM YYYY')}</div>
                </div>
              )}

              {company.description && (
                <div className="bg-white p-4">
                  <div className="mb-2 text-lg font-semibold">
                    About {company.name || company.domain}
                  </div>
                  <div className="mb-2">Information written by the company</div>
                  <div>{company.description}</div>
                </div>
              )}

              {company.information !== null && (
                <div className="bg-white p-4">
                  <div className="mb-2 text-lg font-semibold">Contact</div>
                  <div className="mb-2 space-y-2">
                    {company.information.email && <div>{company.information.email}</div>}
                    {company.information.telephone && <div>{company.information.telephone}</div>}
                    {company.information.street_address && (
                      <div>{company.information.street_address}</div>
                    )}
                    {company.information.city && <div>{company.information.city}</div>}
                    {company.information.zip_code && <div>{company.information.zip_code}</div>}
                    {company.information.country && <div>{company.information.country}</div>}
                  </div>
                </div>
              )}

              {company.claimed_at === null && (
                <div className="bg-white p-4">
                  <div className="mb-2 text-lg font-semibold">Is this your company?</div>
                  <div className="mb-2">
                    Claim your company to access business tools and start getting closer to your
                    customers today!
                  </div>
                  <div>
                    <Link href="/claim-company">
                      <a className="px-4 py-2 border bg-indigo-600 text-white border-indigo-600 inline-block">
                        Claim a company
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Review;
