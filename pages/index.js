import React from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import SearchForm from '../components/home/SearchForm';
import RecentReviews from '../components/home/RecentReviews';

export async function getServerSideProps(context) {
  const props = {};
  try {
    const response = await axios.get('/reviews/recent');
    props.recentReviews = response.data;
  } catch (error) {}
  return { props };
}

const Home = ({ recentReviews = [] }) => (
  <>
    <Layout>
      <div className="bg-red-200">
        <div className="w-full max-w-6xl mx-auto">
          <div className="h-96 flex flex-row items-center lg:w-3/6">
            <div className="w-full">
              <h1 className="text-4xl font-bold mb-4">
                Behind every review is an experience that matters
              </h1>
              <p className="font-semibold mb-4 text-lg text-gray-700">
                Read reviews. Write reviews. Find companies.
              </p>
              <SearchForm />
            </div>
          </div>
        </div>
      </div>
      <RecentReviews reviews={recentReviews} />
    </Layout>
  </>
);

export default Home;
