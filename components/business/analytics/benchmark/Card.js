import axios from 'axios';
import StarRating from 'components/common/StarRating';
import React, { useEffect, useState } from 'react';
import Spinner from 'components/common/Spinner';

const Card = ({ uuid, onRemove }) => {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/companies/${uuid}/info`);
        setData(response.data);
        const categoriesResponse = await axios.get(`/companies/${uuid}/categories`);
        setCategories(categoriesResponse.data);
      } catch (error) {}
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <div className="bg-white p-4 w-72 border text-sm relative mr-4 h-full">
      {isLoading && (
        <div className="flex justify-center items-center h-72">
          <Spinner />
        </div>
      )}
      {!isLoading && data !== null && (
        <>
          <button
            type="button"
            className="absolute w-6 h-6 rounded-full bg-white right-4 top-4 border z-10 p-1"
            onClick={() => onRemove(uuid)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="mb-2">
            <h3 className="font-semibold text-lg">{data.name}</h3>
            <div>
              <a href={`http://${data.domain}`} target="_blank" rel="noreferrer">
                {data.domain}
              </a>
            </div>
          </div>
          <div className="py-2 flex flex-row items-center justify-between border-b">
            <StarRating value={data.average_rating} size="md" />
            <div>
              <span className="text-xl font-semibold">
                {parseFloat(data.average_rating).toFixed(1)}
              </span>{' '}
              / <span>5</span>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mb-2 py-2">
            <span>Status</span>
            <span>{data.claimed_at !== null ? 'Claimed' : 'Unclaimed'}</span>
          </div>
          <div>
            <div className="flex flex-row justify-between items-center mb-2">
              <span>Total reviews</span>
              <span>{data.reviews_count}</span>
            </div>
            <div className="space-y-2">
              <div className="flex flex-row justify-between items-center">
                <div className="flex-none w-20">Excellent</div>
                <div className="flex-grow bg-gray-100 h-5">
                  <div
                    className="h-5"
                    style={{
                      backgroundColor: '#00b67a',
                      width: `${(((data.stars['5'] || 0) / data.reviews_count) * 100).toFixed(1)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex-none w-14 text-right">{`${(
                  ((data.stars['5'] || 0) / data.reviews_count) *
                  100
                ).toFixed(1)}%`}</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex-none w-20">Great</div>
                <div className="flex-grow bg-gray-100 h-5">
                  <div
                    className="h-5"
                    style={{
                      backgroundColor: '#73cf11',
                      width: `${(((data.stars['4'] || 0) / data.reviews_count) * 100).toFixed(1)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex-none w-14 text-right">{`${(
                  ((data.stars['4'] || 0) / data.reviews_count) *
                  100
                ).toFixed(1)}%`}</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex-none w-20">Average</div>
                <div className="flex-grow bg-gray-100 h-5">
                  <div
                    className="h-5"
                    style={{
                      backgroundColor: '#ffce00',
                      width: `${(((data.stars['3'] || 0) / data.reviews_count) * 100).toFixed(1)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex-none w-14 text-right">{`${(
                  ((data.stars['3'] || 0) / data.reviews_count) *
                  100
                ).toFixed(1)}%`}</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex-none w-20">Poor</div>
                <div className="flex-grow bg-gray-100 h-5">
                  <div
                    className="h-5"
                    style={{
                      backgroundColor: '#ff8622',
                      width: `${(((data.stars['2'] || 0) / data.reviews_count) * 100).toFixed(1)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex-none w-14 text-right">{`${(
                  ((data.stars['2'] || 0) / data.reviews_count) *
                  100
                ).toFixed(1)}%`}</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex-none w-20">Bad</div>
                <div className="flex-grow bg-gray-100 h-5">
                  <div
                    className="h-5"
                    style={{
                      backgroundColor: '#ff3722',
                      width: `${(((data.stars['1'] || 0) / data.reviews_count) * 100).toFixed(1)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex-none w-14 text-right">{`${(
                  ((data.stars['1'] || 0) / data.reviews_count) *
                  100
                ).toFixed(1)}%`}</div>
              </div>
            </div>
          </div>
          {categories.length > 0 && (
            <div className="mt-4 border-t pt-2">
              <div className="text-base mb-2">Categories</div>
              <div className="space-y-2">
                {categories.map((row) => (
                  <a className="block text-gray-600">{row.category.name}</a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(Card);
