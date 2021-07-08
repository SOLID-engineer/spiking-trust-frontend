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
import router from 'next/router';
import toast from 'utils/toast';

import Spinner from 'components/common/Spinner';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const { query } = context;
  if (!session) {
    return {
      redirect: {
        destination: `/login?returnUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  return { props: { query } };
};

const ReviewAdmin = ({ query }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pages, setPages] = useState({
    current_page: query?.page || 1,
    last_page: 0,
    total: 0,
    per_page: 20,
  });

  const getReviews = async (params = {}) => {
    setLoading(true);
    const response = await axios.get('/admin/reviews', { params });
    const { data = [] } = response;
    setReviews(data.items);
    setPages({
      current_page: data.current_page,
      last_page: data.last_page,
      total: data.total,
      per_page: data.per_page,
    });
    setLoading(false);
  };

  const changePage = ({ page }) => {
    router.push({ pathname: '/admin/reviews' }, { query: { ...query, page } }, { shallow: true });
    getReviews({ ...query, page });
  };

  const removeRecord = async (id) => {
    try {
      const confirm = window.confirm('Are you sure delete record?');
      if (!confirm) return;
      const response = await axios.delete(`/admin/reviews/${id}`);
      const { msg = 'Deleted record success.' } = response;
      toast.success(msg);
      getReviews({ ...query, page: pages.current_page });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReviews({ ...query, page: pages.current_page });
  }, []);

  return (
    <AdminLayout pageTitle="Reviews">
      <div className="w-full sm:px-6">
        <div className="p-4 bg-gray-100">
          <div className="sm:flex items-center justify-between">
            <p className="focus:outline-none uppercase text-base sm:text-lg font-bold leading-normal text-gray-800">
              List reviews
            </p>
          </div>
        </div>
        <div className="bg-white pb-5 overflow-y-auto">
          <p className="font-bold text-xs pt-5 px-4">
            {reviews.length}/{pages.total || 0} reviews
          </p>
          {loading ? (
            <div className="flex justify-center items-center h-72">
              <Spinner />
            </div>
          ) : (
            <>
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="w-full text-xs leading-none uppercase font-bold">
                    <th className="p-5 text-left">Reviewed Item</th>
                    <th className="p-5 text-left">Reviewed By</th>
                    <th className="p-5 text-left w-96">Title</th>
                    <th className="p-5 text-left w-96">Content</th>
                    <th className="p-5 text-left">IP</th>
                    <th className="p-5 text-left">Created at</th>
                    <th className="p-5 text-left w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {reviews.map((review) => {
                    return (
                      <tr
                        key={review.id}
                        className="h-20 text-xs leading-none text-gray-800 bg-white border-b border-t border-gray-100"
                      >
                        <td className="cursor-pointer">
                          <div className="flex flex-col">
                            <span className="pl-5 py-2">{review.company?.name || '---'}</span>
                            <a
                              target="_blank"
                              href={`https://${review.company?.domain}`}
                              className="pl-5 text-blue-500"
                              rel="noreferrer"
                            >
                              {review.company?.domain}
                            </a>
                          </div>
                        </td>
                        <td className="cursor-pointer">
                          <div className="items-center">
                            <p className="pl-5">
                              {review.author?.first_name || ' --- '}{' '}
                              {review.author?.last_name || ' --- '}
                            </p>
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
                          <p className="pl-5 whitespace-pre-wrap">{review.ip_address}</p>
                        </td>

                        <td className="cursor-pointer">
                          <div className="flex items-center">
                            <p className="pl-5">
                              {dayjs(review.created_at).format('H:mm:ss MM/DD/YYYY')}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="flex ml-5">
                            <Link href={`/admin/reviews/edit/${review.id}`}>
                              <p
                                className="btn btn-sm btn-clean btn-icon mr-2 h-6 w-6 cursor-pointer"
                                title="Edit details"
                              >
                                <span className="text-xs">
                                  <EditIcon />
                                </span>
                              </p>
                            </Link>
                            <button
                              className="btn btn-sm btn-clean btn-icon mr-2 cursor-pointer h-6 w-6"
                              title="Detele details"
                              onClick={() => removeRecord(review.id)}
                            >
                              <span className="text-xs text-red-400">
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
                <div className="flex flex-col items-center my-5 mx-5">
                  <Paginate
                    currentPage={pages.current_page}
                    lastPage={pages.last_page}
                    changePage={changePage}
                    total={pages.total}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
export default ReviewAdmin;
