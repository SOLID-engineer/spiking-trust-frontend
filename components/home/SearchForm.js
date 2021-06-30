import React, { useCallback, useEffect, useState } from 'react';
import { debounce, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

const SearchForm = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isEmpty(query)) router.push(`/search?query=${query}`);
  };

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

  useEffect(() => {
    debouncedGetSuggestions();
    return debouncedGetSuggestions.cancel;
  }, [query, debouncedGetSuggestions]);

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="flex flex-row bg-gray-100 p-2 w-full">
        <div className="flex-grow">
          <input
            className="text-lg focus:outline-none bg-gray-100 px-2 py-2 w-full"
            placeholder="Company or category"
            name="query"
            onChange={onQueryChange}
            value={query}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="text-lg focus:outline-none px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-800"
          style={{ backgroundColor: '#008df4' }}
        >
          Search
        </button>
      </div>
      {query.length > 1 && (
        <div className="absolute w-full bg-white border-t left-0 top-full p-2 text-sm shadow-md z-20">
          {!isEmpty(suggestions?.companies) && (
            <div>
              <div className="mb-2 font-semibold px-2">Companies</div>
              <div className="mb-4 space-y-1">
                {suggestions.companies.map((company) => (
                  <Link href={`/review/${company.domain}`} key={company.id}>
                    <a className="hover:bg-indigo-100 block px-2 py-1">
                      <div className="font-bold text-base">{company.name || company.domain}</div>
                      <div>{company.domain}</div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="border-t pt-2">
            <Link href={`/search?query=${query}`}>
              <a className="block bg-indigo-600 text-white hover:bg-indigo-800 px-3 py-2">
                Show all results
              </a>
            </Link>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchForm;
