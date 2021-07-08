import axios from 'axios';
import Link from 'next/link';
import React from 'react';

import Layout from '../../components/layout';

export const getServerSideProps = async (context) => {
  const props = {};
  try {
    const response = await axios.get(`/categories`);
    props.categories = response.data;
    props.categories_parent = response.data.filter((category) => parseInt(category.level) === 1);
  } catch (error) {}
  return { props };
};

const Categories = (props) => {
  const { categories = [], categories_parent = [] } = props;

  return (
    <Layout>
      <div className="w-full bg-white">
        <div className="max-w-6xl py-8 px-3 mx-auto font-bold text-3xl">
          <h2>Compare the best companies on Trustpilot</h2>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-3 ">
        <div className="md:grid md:grid-cols-3 gap-4">
          <aside>
            <div className="px-5 py-6 bg-white">
              <h3 className="text-lg font-semibold mb-6">View Category</h3>
              <div className="text-sm">
                <ul>
                  {categories_parent.map((category) => {
                    return (
                      <li
                        key={`ls-${category.id}`}
                        className="mb-4 font-semibold pb-4 border-b md:border-none md:py-0"
                        key={category.id}
                      >
                        <p className="block md:hidden" href={`#${category.slug}`}>
                          <Link href={`/categories/${category.slug}`}>
                            <span className="hover:text-blue-700 cursor-pointer">
                              {category.name}
                            </span>
                          </Link>
                        </p>
                        <a className="hidden md:block" href={`#${category.slug}`}>
                          <span className="hover:text-blue-700">{category.name}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>
          <section className="md:col-span-2 hidden md:block">
            <div className="bg-white py-7 px-6 text-sm">
              {categories_parent.map((category) => {
                return (
                  <div
                    id={`${category.slug}`}
                    key={category.id}
                    className="grid grid-cols-3 gap-4 py-4"
                  >
                    <div>
                      <h3 className="text-lg font-normal">
                        <Link href={`/categories/${category.slug}`}>
                          <span className="cursor-pointer">{category.name}</span>
                        </Link>
                      </h3>
                    </div>
                    <div className="col-span-2 grid grid-cols-2 gap-4 border-b pb-10">
                      {categories &&
                        categories.map((child) => {
                          return (
                            child.parent_id === category.id && (
                              <div key={child.id}>
                                <Link href={`/categories/${child.slug}`}>
                                  <span className="hover:text-blue-700 cursor-pointer">
                                    {child.name}
                                  </span>
                                </Link>
                              </div>
                            )
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
