import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';

import BusinessSelector from 'slices/business/selector';
import BusinessLayout from 'components/business-layout';
import { isEmpty } from 'lodash';

const CategoryBusiness = () => {
  const [categories, setCategories] = useState([]);
  const [lsCategories, setLsCategories] = useState([]);
  const [selected, setSelected] = useState(null);

  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);

  const handleCreate = async () => {
    if (selected) {
      const response = await axios.post(`/business/${currentCompany.domain}/categories`, {
        category: selected,
      });
      await getCatgoryByDomain();
    }
  };

  const getCatgoryByDomain = async () => {
    const categoriesRes = await axios.get(`/business/${currentCompany.domain}/categories`);
    setLsCategories(categoriesRes.data);
  };

  const removeCategory = async (id) => {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    const response = await axios.delete(`/business/${currentCompany.domain}/categories`, {
      data: { category: id },
    });
    await getCatgoryByDomain();
  };

  const setDefaultCategory = async (id) => {
    const response = await axios.put(`/business/${currentCompany.domain}/categories`, {
      category: id,
    });
    await getCatgoryByDomain();
  };

  useEffect(async () => {
    if (currentCompany) {
      await getCatgoryByDomain();
      const response = await axios.get(`/business/categories`);
      const newCategories = response.data.map((item) => {
        return item.children?.length === 0 && { value: item.id, label: item.name };
      });
      setCategories(newCategories);
    }
  }, [currentCompany]);

  return (
    <BusinessLayout pageTitle="Categories">
      {currentCompany !== null && (
        <>
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white">
              <div className=" p-5">
                <h3 className="font-semibold text-xl mb-4">Choose a category</h3>
                <p className="text-gray-500">
                  Stand out on Trustpilot and in search results by placing your company in the
                  appropriate category. You can add your company in up to 6 categories (1 primary, 5
                  secondary)
                </p>
                <div className="mt-4 flex">
                  <Select
                    className="flex-1"
                    options={categories}
                    isClearable
                    onChange={(event) => setSelected(event.value)}
                  />
                  <button
                    className="ml-2 py-2 px-5 bg-indigo-600 text-white rounded-md"
                    onClick={handleCreate}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white mt-5">
              <div className="p-5">
                <h3 className="font-semibold text-xl mb-4 border-b pb-4">
                  You've added your business to these categories:
                </h3>
                <div>
                  {lsCategories.map((category) => {
                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between border-b py-3"
                      >
                        <div className="flex">
                          <span className="">{category.name}</span>
                          {category.company?.is_primary ? (
                            <span className="ml-2 bg-indigo-500 px-1 rounded-sm text-xs text-white font-semibold flex items-center">
                              Primary
                            </span>
                          ) : null}
                        </div>
                        <div className="flex space-x-2">
                          {!category.company?.is_primary ? (
                            <button
                              onClick={() => setDefaultCategory(category.id)}
                              className="py-1 px-5 text-sm hover:border-blue-500 border font-semibold hover:text-blue-500 rounded-sm"
                            >
                              Set as primary
                            </button>
                          ) : null}

                          <button
                            onClick={() => removeCategory(category.id)}
                            className="py-1 px-5 text-sm border-red-500 border font-semibold text-red-500 rounded-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </BusinessLayout>
  );
};

export default CategoryBusiness;
