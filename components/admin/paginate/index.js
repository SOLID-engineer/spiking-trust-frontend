import React from 'react';

export default function Paginate({ currentPage = 1, lastPage = 0, ...props }) {
  const pagesDisplayed = 3;
  const renderPage = (page) => {
    return (
      <div
        {...props}
        key={page}
        className={`w-8 md:flex justify-center items-center hidden
            cursor-pointer leading-5 transition duration-150 ease-in
            border-b-2 border-transparent ${currentPage === page ? 'border-red-600' : null}`}
      >
        {page}
      </div>
    );
  };

  const renderPages = () => {
    const items = [];
    let leftSide = pagesDisplayed / 2;
    let rightSide = pagesDisplayed - leftSide;
    let breakView;

    if (currentPage > lastPage - pagesDisplayed / 2) {
      rightSide = lastPage - currentPage;
      leftSide = pagesDisplayed - rightSide;
    } else if (currentPage < pagesDisplayed / 2) {
      leftSide = currentPage;
      rightSide = pagesDisplayed - leftSide;
    }

    for (let page = 1; page <= lastPage; page++) {
      if (page <= pagesDisplayed) {
        items.push(renderPage(page));
        continue;
      }
      if (page > lastPage - pagesDisplayed) {
        items.push(renderPage(page));
        continue;
      }
      if (page >= currentPage - leftSide && page <= currentPage + rightSide) {
        items.push(renderPage(page));
        continue;
      }

      if (items[items.length - 1] !== breakView) {
        breakView = (
          <div
            key={page}
            className={`w-8 md:flex justify-center items-center hidden
            cursor-pointer leading-5 transition duration-150 ease-in
            border-b-2 border-transparent ${currentPage === page ? 'border-red-600' : null}`}
          >
            ...
          </div>
        );
        items.push(breakView);
      }
    }
    return items;
  };
  return (
    <>
      <div className="flex text-gray-700">
        <div className="flex h-8 font-medium ">{renderPages()}</div>
      </div>
    </>
  );
}
