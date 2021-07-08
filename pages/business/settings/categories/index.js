import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';
import Spinner from 'components/common/Spinner';

import BusinessSelector from 'slices/business/selector';
import BusinessLayout from 'components/business-layout';
import withCompany from 'components/hocs/withCompany';
import { filter, isEmpty, lowerCase } from 'lodash';

const CategoryBusiness = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [companyCategories, setCompanyCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(filter(response.data, { level: 3 }));
    } catch (error) {}
  };

  const getCompanyCategories = async () => {
    try {
      const response = await axios.get(`/companies/${currentCompany.uuid}/categories`);
      setCompanyCategories(response.data);
    } catch (error) {}
  };

  const onReset = () => {
    setSearch('');
    setSelectedCategory(null);
  };

  const onSearchChange = (e) => {
    setSelectedCategory(null);
    setSearch(e.target.value);
  };

  const onSelect = (category) => {
    setSearch(category.name);
    setSelectedCategory(category);
  };

  const handleAddCategory = async () => {
    if (selectedCategory !== null) {
      try {
        await axios.post(`/business/${currentCompany.domain}/categories`, {
          category: selectedCategory.id,
        });
        onReset();
        getCompanyCategories();
      } catch (error) {}
    }
  };

  const handleRemoveCategory = async (category) => {
    try {
      await axios.delete(`/business/${currentCompany.domain}/categories`, {
        data: { category: category.id },
      });
      getCompanyCategories();
    } catch (error) {}
  };

  const handleSetAsPrimary = async (category) => {
    try {
      await axios.patch(`/business/${currentCompany.domain}/categories`, {
        category: category.id,
      });
      getCompanyCategories();
    } catch (error) {}
  };

  useEffect(() => {
    setFilteredCategories(
      filter(categories, (category) => lowerCase(category.name).indexOf(lowerCase(search)) !== -1)
    );
  }, [search]);

  useEffect(() => {
    getCompanyCategories();
  }, [currentCompany]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <BusinessLayout pageTitle="Categories">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white p-4 mb-4 border">
          <h3 className="font-semibold text-lg mb-2">Choose a category</h3>
          <p className="text-gray-500">
            Stand out in search results by placing your company in the appropriate category.
            <br />
            You can add your company in up to 6 categories (1 primary, 5 secondary)
          </p>
          <div className="mt-4 flex flex-row space-x-4">
            <div className="relative flex flex-row flex-grow border items-center">
              <input
                type="text"
                className="py-2 px-4 flex-grow"
                placeholder="Search categories"
                value={search}
                onChange={onSearchChange}
                disabled={companyCategories.length >= 6}
              />
              {!isEmpty(search) && (
                <button type="button" className="w-5 h-5 flex-none mx-2" onClick={onReset}>
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
              )}
              {!isEmpty(search) && selectedCategory === null && filteredCategories.length > 0 && (
                <div className="absolute w-full top-full left-0 bg-white shadow-sm border border-gray-100">
                  <ul className="overflow-y-auto max-h-64">
                    {filteredCategories.map((category) => (
                      <li key={category.id}>
                        <a
                          className="px-6 py-2 block hover:bg-gray-50"
                          role="button"
                          aria-hidden="true"
                          onClick={() => onSelect(category)}
                        >
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              type="button"
              className="py-2 px-6 bg-indigo-600 text-white flex-none"
              disabled={selectedCategory === null}
              onClick={handleAddCategory}
            >
              Add
            </button>
          </div>
        </div>
        <div className="bg-white p-4 border">
          <h3 className="font-semibold text-lg mb-2 border-b pb-2">
            You&apos;ve added your business to these categories:
          </h3>
          <div className="divide-y">
            {companyCategories.map((row) => (
              <div
                key={row.category_id}
                className="flex flex-row items-center py-2 justify-between"
              >
                <div>
                  <span className="mr-2">{row.category.name}</span>
                  {row.is_primary === 1 && (
                    <span className="inline-block bg-indigo-500 px-2 py-1 text-xs text-white uppercase">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex flex-row space-x-2">
                  {row.is_primary !== 1 && (
                    <>
                      <button
                        type="button"
                        className="py-1 px-5 text-sm hover:border-blue-500 border font-semibold hover:text-blue-500"
                        onClick={() => handleSetAsPrimary(row.category)}
                      >
                        Set as primary
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="py-1 px-5 text-sm border-red-500 border font-semibold text-red-500"
                    onClick={() => handleRemoveCategory(row.category)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default withCompany(CategoryBusiness);
