import React from 'react';
import axios from 'axios';

import Link from 'next/link';
import Layout from '../../components/layout';
import { wrapper } from '../../slices/store';

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  const { category } = context.params;
  const props = {};
  props.slug = category;
  try {
    const [categoriesRes, companiesRes] = await Promise.all([
      axios.get(`/categories/${category}`),
      axios.get(`/companies/${category}`),
    ]);
    const [categories] = await Promise.all([categoriesRes.data]);

    props.category = categories;
  } catch (error) {}
  return { props };
});

const Evaluate = ({ category, slug }) => {
  return (
    <Layout>
      <div className="w-full bg-white">
        <div className="max-w-6xl py-8 px-3 mx-auto">
          <p className="text-sm pb-2">
            <span className="pr-1"> &lt;</span>
            {category.parent ? (
              <Link href={`/categories/${category.parent.slug}`}>
                <span className="cursor-pointer">{category.parent.name}</span>
              </Link>
            ) : (
              <Link href="/categories">
                <span className="cursor-pointer">View all categories</span>
              </Link>
            )}
          </p>
          <h2 className="font-bold text-3xl"> Best in Pet Stores</h2>
          <p>Top-rated businesses in the Pet Stores category</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-3 ">
        <div className="grid grid-cols-4 gap-4">
          <aside>
            <div className="px-5 py-6 bg-white">
              <div>
                <h3 className="text-lg font-semibold mb-6">Categories</h3>
                <div>
                  <p className="text-sm">
                    {category.parent ? (
                      <Link className="cursor-pointer" href={`/categories/${category.parent.slug}`}>
                        {category.parent.name}
                      </Link>
                    ) : (
                      <Link className="cursor-pointer" href="/categories">
                        <span className="cursor-pointer">View all categories</span>
                      </Link>
                    )}
                  </p>
                </div>
                <div className="px-2 pt-3">
                  <p className="text-sm font-bold">
                    <span>{category?.name}</span>
                  </p>
                  <div className="text-sm p-3">
                    <ul>
                      {category?.children?.map((category) => {
                        return (
                          <li key={category.id} className="mb-2" key={category.id}>
                            <Link className="cursor-pointer" href={`/categories/${category.slug}`}>
                              <span
                                className={`hover:text-blue-700 cursor-pointer ${
                                  slug === category.slug ? 'font-bold' : null
                                }`}
                              >
                                {category.name}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <div className="col-span-3">
            <div className="py-7 px-6">
              <h3 className="font-semibold text-lg">Top-rated companies</h3>
              <p className="text-sm mt-2">
                <span className="font-semibold text-gray-400">Showing 1-20 of 579 results</span>{' '}
                based on current filters.
              </p>
              <div className="my-6">
                <div className="mb-4 bg-white py-4">
                  <a href="/">
                    <div className="flex">
                      <div className="w-1/4 flex justify-center">
                        <img
                          className="w-32"
                          src="//s3-eu-west-1.amazonaws.com/tpd/logos/5c29129cd9f1f10001db3141/0x0.png"
                          alt="Tweedle Farms"
                        />
                      </div>
                      <div className="w-3/4">
                        <h3 className="font-semibold text-lg">Tweedle Farms</h3>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Evaluate;
