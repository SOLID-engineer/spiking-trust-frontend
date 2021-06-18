/* eslint-disable no-use-before-define */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import Layout from 'components/layout';

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
  const router = useRouter();
  const token = router.query?.v;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        await axios.post('/companies/accept-company', { token });
      } catch (error) {
        setError(error.response.data.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  return (
    <Layout>
      <div className="min-h-96">
        <div className="w-full max-w-xl mx-auto my-8">
          <div className="bg-white p-4 shadow text-center">
            {isLoading ? (
              <div>
                <h1 className="text-xl font-bold">Please wait...</h1>
              </div>
            ) : (
              <div>
                {error === null ? (
                  <>
                    <h1 className="text-2xl mb-4">Company claimed successfully</h1>
                    <div>
                      <Link href="/business">
                        <a className="inline-block px-4 py-2 bg-indigo-600 text-white">
                          Go to Business Dashboard
                        </a>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl mb-4">{error}</h1>
                    <div>
                      <Link href="/">
                        <a className="inline-block px-4 py-2 bg-indigo-600 text-white">
                          Go to homepage
                        </a>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClaimCompany;
