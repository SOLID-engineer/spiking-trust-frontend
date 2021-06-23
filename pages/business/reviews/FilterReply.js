/* eslint-disable no-nested-ternary */
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Formik } from 'formik';

const FilterReply = ({ getData }) => {
  const router = useRouter();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdownVisible = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };

  const handleFormSubmit = async (values) => {
    const { page, reply, ...rest } = router.query;
    const params = { ...rest, reply: values.reply };
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
        className={`border px-3 py-1 text-sm ${
          router.query.reply !== undefined ? 'border-blue-600 text-blue-600' : ''
        }`}
        onClick={toggleDropdownVisible}
      >
        {router.query.reply === undefined
          ? 'Reply'
          : router.query.reply === 'true'
          ? 'Reviews with a reply'
          : 'Reviews without a reply'}
      </button>

      {isDropdownVisible && (
        <div className="left-0 w-64 absolute border mt-1 bg-white text-sm z-40">
          <Formik
            initialValues={{
              reply: router.query.reply === undefined ? null : router.query.reply === 'true',
            }}
            onSubmit={handleFormSubmit}
          >
            {({ setFieldValue, handleSubmit, values }) => (
              <>
                <div className="py-2">
                  <div
                    role="button"
                    aria-hidden="true"
                    className={`flex flex-row items-center px-4 py-2 ${
                      values.reply === true ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setFieldValue('reply', values.reply === true ? null : true)}
                  >
                    <div className="flex-grow">
                      Reviews <strong>with a reply</strong>
                    </div>
                  </div>
                  <div
                    role="button"
                    aria-hidden="true"
                    className={`flex flex-row items-center px-4 py-2 ${
                      values.reply === false ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setFieldValue('reply', values.reply === false ? null : false)}
                  >
                    <div className="flex-grow">
                      Reviews <strong>without a reply</strong>
                    </div>
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
                  {values.reply !== null && (
                    <button
                      type="button"
                      className="border px-3 py-1 text-sm bg-white"
                      onClick={() => {
                        setFieldValue('reply', null);
                        const { page, reply, ...rest } = router.query;
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

export default FilterReply;
