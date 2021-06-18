import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/admin';
import Link from 'next/link';

import axios from 'axios';
import EditIcon from 'components/icons/edit';
import TrashIcon from 'components/icons/trash';
import dayjs from 'dayjs';
import StarRating from 'components/common/StarRating';
import Paginate from 'components/admin/paginate';

import { getSession } from 'next-auth/client';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/login?returnUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

const ReviewAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [pages, setPages] = useState([]);

  const getReviews = async (params = {}) => {
    const response = await axios.get('/admin/reviews', { params });
    const { data = [] } = response;
    setReviews(data.items);
    setPages({
      current_page: data.current_page,
      last_page: data.last_page,
      total: data.total,
      per_page: data.per_page,
    });
  };

  const changePage = () => {
    getReviews({ page: pages.current_page + 1 });
  };

  const removeRecord = async (id) => {
    try {
      const confirm = window.confirm('Are you sure delete record?');
      if (!confirm) return;
      const response = await axios.delete(`/admin/reviews/${id}`);
      const { msg = 'Deleted record success.' } = response;
      alert(msg);
      getReviews();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <AdminLayout pageTitle="reviews">
      <div className="w-full sm:px-6">
        <div className="px-4 md:px-10 py-4 md:py-5 bg-gray-100  rounded-tl-md rounded-tr-md">
          <div className="sm:flex items-center justify-between">
            <p
              tabIndex={0}
              className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-xl font-bold leading-normal text-gray-800"
            >
              List reviews
            </p>
          </div>
        </div>
        <div className="bg-white shadow md:px-6 pt-4 md:pt-7 pb-5 overflow-y-auto rounded-bl-md rounded-br-md">
          <p className="font-bold text-sm py-5">
            {reviews.length}/{pages.total || 0} reviews
          </p>
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-200 text-gray-600 w-full text-sm leading-none uppercase font-bold">
                <th className="p-5 text-left">Reviewed Item</th>
                <th className="p-5 text-left">Reviewed By</th>
                <th className="p-5 text-left w-96">Title</th>
                <th className="p-5 text-left w-96">Content</th>
                <th className="p-5 text-left">Created at</th>
                <th className="p-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {reviews.map((review) => {
                return (
                  <tr
                    key={review.id}
                    className="h-20 text-sm leading-none text-gray-800 bg-white border-b border-t border-gray-100"
                  >
                    <td className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="pl-5 py-2">{review.company?.name || '---'}</span>
                        <a
                          target="_blank"
                          href={`https://${review.company?.name}`}
                          className="pl-5 text-blue-500"
                          rel="noreferrer"
                        >
                          {review.company?.domain}
                        </a>
                      </div>
                    </td>
                    <td className="cursor-pointer">
                      <div className="items-center">
                        <p className="pl-5">{review.claimed_at || ' --- '}</p>
                        <p className="pl-5">{review.claimed_by || ' --- '}</p>
                      </div>
                    </td>
                    <td className="cursor-pointer">
                      <div className="pl-5">
                        <StarRating value={review.rating || 0} size="sm" />
                        <p className="whitespace-pre-wrap mt-2">{review.title}</p>
                      </div>
                    </td>

                    <td className="cursor-pointer">
                      <p className="pl-5 whitespace-pre-wrap">{review.content}</p>
                    </td>

                    <td className="cursor-pointer">
                      <div className="flex items-center">
                        <p className="pl-5">{dayjs(review.created_at).format('H:ss MM/DD/YYYY')}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex ml-5">
                        <Link href={`/admin/categories/edit/${review.id}`}>
                          <p
                            className="btn btn-sm btn-clean btn-icon mr-2 h-6 w-6"
                            title="Edit details"
                          >
                            <span className="text-sm">
                              <EditIcon />
                            </span>
                          </p>
                        </Link>
                        <button
                          className="btn btn-sm btn-clean btn-icon mr-2  h-6 w-6"
                          title="Detele details"
                          onClick={() => removeRecord(review.id)}
                        >
                          <span className="text-sm text-red-400">
                            <TrashIcon />
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex text-gray-700 mt-4 justify-end">
            <div className="flex flex-col items-center my-12">
              <Paginate
                currentPage={pages.current_page}
                lastPage={pages.last_page}
                onClick={changePage}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default ReviewAdmin;
