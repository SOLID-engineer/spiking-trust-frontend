import axios from 'axios';
import { filter, groupBy } from 'lodash';
import Link from 'next/link';
import React from 'react';

import Layout from '../../components/layout';

export const getServerSideProps = async (context) => {
  const props = {};
  try {
    const response = await axios.get(`/categories`);
    props.categories = groupBy(response.data, 'parent_id');
  } catch (error) {}
  return { props };
};

const Categories = ({ categories = [] }) => (
  <Layout>
    <div className="bg-white">
      <div className="max-w-6xl py-8 px-3 mx-auto font-bold text-3xl">
        <h2>Compare the best companies on Spiking Trust</h2>
      </div>
    </div>
    <div className="max-w-6xl mx-auto py-3 ">
      <div className="lg:grid lg:grid-cols-3 gap-4">
        <aside>
          <div className="p-4 bg-white">
            <h3 className="text-lg font-semibold mb-6">View Category</h3>
            <div className="text-sm">
              <ul className="lg:divide-y">
                {categories?.[0].map((category) => (
                  <li key={category.id} className="mb-4 pb-4 border-b lg:border-none lg:pb-0">
                    <div className="block md:hidden" href={`#${category.slug}`}>
                      <Link href={`/categories/${category.slug}`}>
                        <a className="hover:text-blue-700 cursor-pointer">{category.name}</a>
                      </Link>
                    </div>
                    <a className="hidden md:block" href={`#${category.slug}`}>
                      <span className="hover:text-blue-700">{category.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <section className="lg:col-span-2 hidden lg:block">
          <div className="bg-white p-4 text-sm">
            {categories?.[0].map((category) => (
              <div
                id={`${category.slug}`}
                key={category.id}
                className="grid grid-cols-3 gap-4 mb-8"
              >
                <h3 className="text-lg font-normal">
                  <Link href={`/categories/${category.slug}`}>
                    <a className="cursor-pointer">{category.name}</a>
                  </Link>
                </h3>
                <div className="col-span-2 grid grid-cols-2 gap-4 border-b pb-8">
                  {categories?.[category.id].map((child) => (
                    <div key={child.id}>
                      <Link href={`/categories/${child.slug}`}>
                        <a className="hover:text-blue-700 cursor-pointer">{child.name}</a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </Layout>
);

export default Categories;
