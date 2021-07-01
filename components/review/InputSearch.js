import React, { useState } from 'react';
import SearchIcon from 'components/common/SearchIcon';
import CrossIcon from 'components/common/CrossIcon';
import { useRouter } from 'next/router';

function InputSearch({ getReviews }) {
  const router = useRouter();
  const [textQuery, setTextQuery] = useState(router.query.search || '');
  const onSubmitSearchHandler = (event) => {
    event.preventDefault();
    getReviews({ search: textQuery });
  };

  const onChangeInputHandler = (e) => {
    setTextQuery(e.target.value);
  };

  const onClearSearch = () => {
    setTextQuery('');
    getReviews({ search: '' });
  };

  return (
    <form
      onSubmit={onSubmitSearchHandler}
      className="px-2 align items-center border-gray-300 w-full h-10 flex border flex-row space-x-2 text-sm"
    >
      <SearchIcon />
      <input
        value={textQuery}
        onChange={onChangeInputHandler}
        type="text"
        className="flex-1"
        placeholder="Search reviews"
      />
      <button className={textQuery ? 'block' : 'hidden'} type="button" onClick={onClearSearch}>
        <CrossIcon />
      </button>
    </form>
  );
}

export default InputSearch;
