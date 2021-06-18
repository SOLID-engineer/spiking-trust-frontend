import axios from 'axios';
import BusinessLayout from 'components/business-layout';
import { debounce, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessSelector from 'slices/business/selector';

const Benchmark = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  const onQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const getSuggestions = async () => {
    if (query.length > 1) {
      const response = await axios.get('/search/suggestion', { params: { query } });
      setSuggestions(response.data);
    }
  };

  const debouncedGetSuggestions = useCallback(debounce(getSuggestions, 500), [query]);

  const getData = async () => {
    try {
      const response = await axios.get(`/business/benchmark/${currentCompany.domain}`);
    } catch (error) {}
  };

  useEffect(() => {
    debouncedGetSuggestions();
    return debouncedGetSuggestions.cancel;
  }, [query, debouncedGetSuggestions]);

  useEffect(() => {
    getData();
  }, [currentCompany]);

  return (
    <BusinessLayout pageTitle="Benchmark">
      <div className="flex flex-row space-x-4 overflow-x-auto">
        <div className="flex flex-row space-x-4">
          <div className="bg-white p-2 w-64 border h-96"></div>
          <div className="bg-white p-2 w-64 border"></div>
          <div className="bg-white p-2 w-64 border"></div>
          <div className="bg-white p-2 w-64 border"></div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="bg-white px-6 py-4 border text-blue-500 hover:border-blue-500 flex-none"
            placeholder="Add another company"
            value={query}
            onChange={onQueryChange}
            onBlur={() => {
              setQuery('');
            }}
          />
          {query.length > 1 && (
            <div className="absolute w-full bg-white shadow">
              {!isEmpty(suggestions?.companies) &&
                suggestions.companies.map((company) => (
                  <button
                    type="button"
                    href={`/review/${company.domain}`}
                    key={company.id}
                    className="hover:bg-indigo-50 block px-3 py-2 w-full text-left"
                  >
                    <div className="font-bold text-base">{company.name || company.domain}</div>
                    <div>{company.domain}</div>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default Benchmark;
