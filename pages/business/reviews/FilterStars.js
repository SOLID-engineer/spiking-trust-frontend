import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { includes, union, pull } from 'lodash';
import StarRating from 'components/common/StarRating';

const FilterStars = ({ getData }) => {
  const router = useRouter();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdownVisible = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };

  const handleFormSubmit = async (values) => {
    const { page, stars, ...rest } = router.query;
    const params = { ...rest, stars: values.stars };
    router.push({ pathname: router.pathname, query: params }, undefined, {
      shallow: true,
    });
    getData(params);
    toggleDropdownVisible();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdownVisible}
        className={`border px-3 py-1 text-sm flex flex-row  items-center space-x-2 ${
          router.query.stars?.length > 0 ? 'border-blue-600 text-blue-600' : ''
        }`}
      >
        <span>Star rating</span>
        {router.query.stars?.length > 0 && (
          <span className="rounded-full bg-blue-600 text-white w-4 h-4 leading-none flex items-center justify-center text-xs">
            {router.query.stars?.length}
          </span>
        )}
      </button>

      {isDropdownVisible && (
        <div className="left-0 w-64 absolute border mt-1 bg-white text-sm z-40">
          <Formik initialValues={{ stars: router.query.stars || [] }} onSubmit={handleFormSubmit}>
            {({ setFieldValue, handleSubmit, values }) => (
              <>
                <div className="flex flex-row items-center px-4 py-2 border-b">
                  <div
                    className="flex-grow"
                    role="button"
                    aria-hidden="true"
                    onClick={() =>
                      values.stars.length === 5
                        ? setFieldValue('stars', [])
                        : setFieldValue('stars', ['1', '2', '3', '4', '5'])
                    }
                  >
                    Select all
                  </div>
                </div>
                <div className="py-1">
                  <div
                    role="button"
                    aria-hidden="true"
                    className={`flex flex-row items-center px-4 py-2 ${
                      includes(values.stars, '1') ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() =>
                      setFieldValue(
                        'stars',
                        includes(values.stars, '1')
                          ? pull(values.stars, '1')
                          : union(values.stars, ['1'])
                      )
                    }
                  >
                    <div className="flex-grow">Bad</div>
                    <StarRating value={1} size="sm" />
                  </div>
                  <div
                    role="button"
                    aria-hidden="true"
                    className={`flex flex-row items-center px-4 py-2 ${
                      includes(values.stars, '2') ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() =>
                      setFieldValue(
                        'stars',
                        includes(values.stars, '2')
                          ? pull(values.stars, '2')
                          : union(values.stars, ['2'])
                      )
                    }
                  >
                    <div className="flex-grow">Poor</div>
                    <StarRating value={2} size="sm" />
                  </div>
                  <div
                    role="button"
                    aria-hidden="true"
                    className={`flex flex-row items-center px-4 py-2 ${
                      includes(values.stars, '3') ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() =>
                      setFieldValue(
                        'stars',
                        includes(values.stars, '3')
                          ? pull(values.stars, '3')
                          : union(values.stars, ['3'])
                      )
                    }
                  >
                    <div className="flex-grow">Average</div>
                    <StarRating value={3} size="sm" />
                  </div>
                  <div
                    role="button"
                    aria-hidden="true"
                    className={`flex flex-row items-center px-4 py-2 ${
                      includes(values.stars, '4') ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() =>
                      setFieldValue(
                        'stars',
                        includes(values.stars, '4')
                          ? pull(values.stars, '4')
                          : union(values.stars, ['4'])
                      )
                    }
                  >
                    <div className="flex-grow">Great</div>
                    <StarRating value={4} size="sm" />
                  </div>
                  <div
                    role="button"
                    aria-hidden="true"
                    className={`flex flex-row items-center px-4 py-2 ${
                      includes(values.stars, '5') ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() =>
                      setFieldValue(
                        'stars',
                        includes(values.stars, '5')
                          ? pull(values.stars, '5')
                          : union(values.stars, ['5'])
                      )
                    }
                  >
                    <div className="flex-grow">Excellent</div>
                    <StarRating value={5} size="sm" />
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t space-x-2">
                  <button
                    type="button"
                    className="border px-3 py-1 text-sm bg-white"
                    onClick={handleSubmit}
                  >
                    Apply
                  </button>
                  {values.stars.length > 0 && (
                    <button
                      type="button"
                      className="border px-3 py-1 text-sm bg-white"
                      onClick={() => {
                        setFieldValue('stars', []);
                        const { page, stars, ...rest } = router.query;
                        router.push(
                          {
                            pathname: router.pathname,
                            query: rest,
                          },
                          undefined,
                          {
                            shallow: true,
                          }
                        );
                        getData(rest);
                        toggleDropdownVisible();
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default FilterStars;
