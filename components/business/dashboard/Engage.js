import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessSelector from 'slices/business/selector';
import StarRating from 'components/common/StarRating';
import Spinner from 'components/common/Spinner';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const PER_PAGE = 3;

const Engage = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async (params) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/business/${currentCompany.domain}/reviews`, { params });
      setData(response.data);
    } catch (error) {}
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentCompany !== null)
      getData({
        perPage: PER_PAGE,
      });
  }, [currentCompany]);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <Spinner />
        </div>
      ) : (
        <>
          {data?.items !== undefined && data.items.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg">Engage</h2>
              <div className="text-xs mb-4">Your {PER_PAGE} latest reviews</div>
              <div className="space-y-2">
                {data.items.map((item) => (
                  <div key={item.id} className="p-2 text-sm">
                    <div className="mb-2 whitespace-nowrap break-normal truncate">
                      {item.content}
                    </div>
                    <div className="flex flex-row space-x-2 items-center">
                      <StarRating value={item.rating} size="sm" />
                      <span>
                        By {item.author.first_name} {item.author.last_name},
                      </span>
                      <span>{dayjs().to(dayjs(item.updated_at))}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Engage;
