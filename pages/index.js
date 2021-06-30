import React from 'react';
import axios from 'axios';
import Layout from 'components/layout';
import SearchForm from 'components/home/SearchForm';
import RecentReviews from 'components/home/RecentReviews';
import { useSession } from 'next-auth/client';
import Link from 'next/link';

export async function getServerSideProps() {
  const props = {};
  try {
    const response = await axios.get('/reviews/recent');
    props.recentReviews = response.data;
  } catch (error) {}
  return { props };
}

const Home = ({ recentReviews = [] }) => {
  const [session, loading] = useSession();
  return (
    <>
      <Layout>
        <div className="bg-white">
          <div className="w-full max-w-6xl mx-auto px-4 lg:px-0 home-hero">
            <div className="py-16 flex flex-row items-center lg:w-7/12">
              <div className="w-full">
                <h1 className="text-4xl font-bold mb-4">Share your trading experiences</h1>
                <p className="font-semibold mb-4 text-xl text-gray-700">
                  Because your reviews matter
                </p>
                <div className="mb-6">
                  <SearchForm />
                </div>
                <p className="font-semibold mb-4 text-lg text-gray-700">
                  Browse companies by category
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 text-sm home-categories">
                  <a className="text-center text-white p-2">
                    <div className="h-12 mb-1"></div>
                    <div className="h-14 flex justify-center items-center">Energy</div>
                  </a>
                  <a className="text-center text-white p-2">
                    <div className="h-12 mb-1"></div>
                    <div className="h-14 flex justify-center items-center">Materials</div>
                  </a>
                  <a className="text-center text-white p-2">
                    <div className="h-12 mb-1"></div>
                    <div className="h-14 flex justify-center items-center">Industrials</div>
                  </a>
                  <a className="text-center text-white p-2">
                    <div className="h-12 mb-1"></div>
                    <div className="h-14 flex justify-center items-center">
                      Consumer Discretionary
                    </div>
                  </a>
                  <a className="text-center text-white p-2">
                    <div className="h-12 mb-1"></div>
                    <div className="h-14 flex justify-center items-center">Consumer Staples</div>
                  </a>
                  <a className="text-center text-white p-2">
                    <div className="h-12 mb-1"></div>
                    <div className="h-14 flex justify-center items-center">Healthcare</div>
                  </a>
                  <a className="text-center text-white p-2">
                    <div className="h-12 mb-1"></div>
                    <div className="h-14 flex justify-center items-center">Financial</div>
                  </a>
                  <a className="text-center text-white p-2">
                    <div className="h-12 mb-1"></div>
                    <div className="h-14 flex justify-center items-center">
                      Information Technology
                    </div>
                  </a>
                  <a className="text-center text-white p-2">
                    <div className="h-12 mb-1"></div>
                    <div className="h-14 flex justify-center items-center text-xs">
                      Telecommunication Services
                    </div>
                  </a>
                  <Link href="/categories">
                    <a className="text-center text-white p-2">
                      <div className="h-12 mb-1"></div>
                      <div className="h-14 flex justify-center items-center">More</div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RecentReviews reviews={recentReviews} />
      </Layout>
    </>
  );
};

export default Home;
