import axios from 'axios';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../../components/layout';

export async function getServerSideProps(context) {
  const { query } = context.query;
  const props = {};
  try {
    const response = await axios.get('/search', {
      params: { query },
    });
    props.results = response.data;
  } catch (error) {
    console.log('🚀 ~ file: index.js ~ line 35 ~ getServerSideProps ~ error', error);
  }
  return { props };
}

const Search = ({ results }) => {
  const router = useRouter();
  const { query } = router.query;
  const [items, setItems] = useState(results.items);
  const [currentPage, setCurrentPage] = useState(results.current_page);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleCreateDomain = async (domain) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const response = await axios.post('/search/create-domain', {
        domain,
      });

      router.push(`/review/${response.data.domain}`);
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  const handleLoadMore = async () => {
    try {
      const response = await axios.get('/search', {
        params: { ...router.query, page: currentPage + 1 },
      });
      setItems([...items, ...response.data.items]);
      setCurrentPage((prevState) => prevState + 1);
    } catch (error) {}
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto py-8">
        {items.length === 0 ? (
          <>
            <h1 className="text-3xl font-bold mb-4">
              Oops, we couldn’t find any results matching &quot;{query}&quot;
            </h1>
            <div className="mb-4">
              First, check the spelling of your search. If it’s correct, the business may not be
              listed on Spiking Trust yet.
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">
              Here are your results for &quot;{query}&quot;
            </h1>
            <div className="mb-8 space-y-6">
              {items.map((item) => (
                <div key={item.id}>
                  <div>
                    <Link href={`/review/${item.domain}`}>
                      <a className="text-lg font-semibold text-blue-800">
                        {item.name || item.domain} - {item.domain}
                      </a>
                    </Link>
                  </div>
                  <div className="flex flex-row divide-x items-center space-x-4">
                    <span>123 reviews</span>
                    <span className="pl-4">Rating 4.5</span>
                    <Link href={`/evaluate/${item.domain}`}>
                      <a className="text-blue-800 pl-4">Write a review</a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {currentPage < results.last_page && (
              <div className="mb-8">
                <button
                  type="button"
                  className="text-center text-white font-semibold bg-indigo-600 w-96 py-3"
                  onClick={handleLoadMore}
                >
                  Show more companies
                </button>
              </div>
            )}
          </>
        )}
        <div>
          {isCreateFormVisible ? (
            <>
              {isError && (
                <div className="px-6 py-3 mb-4 bg-yellow-100 text-yellow-800">
                  Oops something went wrong.
                </div>
              )}
              <Formik
                initialValues={{ domain: '' }}
                onSubmit={(values) => {
                  const { domain } = values;
                  handleCreateDomain(domain);
                }}
              >
                {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-row space-x-2 items-center">
                      <input
                        className="border border-gray-300 focus:outline-none px-3 py-2"
                        placeholder="www.google.com"
                        name="domain"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.domain}
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-800"
                        disabled={isLoading}
                      >
                        Review this company
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </>
          ) : (
            <button
              type="button"
              className="focus:outline-none text-green-600"
              onClick={() => {
                setIsCreateFormVisible(true);
              }}
            >
              Be the first to review them.
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
