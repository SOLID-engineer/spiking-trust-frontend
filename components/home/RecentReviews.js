import Link from 'next/link';
import React from 'react';
import StarRating from '../common/StarRating';

const RecentReviews = ({ reviews }) => (
  <div className="py-10 px-4">
    <div className="text-center font-semibold text-xl mb-8">Recent reviews</div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="w-full text-sm">
          <div className="p-4 bg-white h-48 overflow-y-auto">
            <div className="mb-2">
              <StarRating value={review.rating} size="sm" />
            </div>
            <div className="mb-3">
              <span className="font-semibold">{review.author.first_name}</span>
              {' reviewed '}
              <Link href={`/review/${review.company.domain}`}>
                <a className="font-semibold">{review.company.name || review.company.domain}</a>
              </Link>
            </div>
            <div>&quot;{review.content}&quot;</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default React.memo(RecentReviews);
