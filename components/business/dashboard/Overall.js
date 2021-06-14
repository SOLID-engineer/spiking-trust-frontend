import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessSelector from '../../../slices/business/selector';
import StarRating from '../../common/StarRating';

const Overall = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/companies/${currentCompany.domain}`);
      setData(response.data);
    } catch (error) {}
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentCompany !== null) getData();
  }, [currentCompany]);

  return (
    <div>
      {isLoading ? (
        <div className="h-40"></div>
      ) : (
        <>
          {data !== null && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Overall performance</h2>
              <div className="flex flex-row space-x-4 items-center mb-2">
                <StarRating value={data.average_rating} />
                <div>{parseFloat(data.average_rating).toFixed(1)}</div>
              </div>
              <div className="text-sm">Based on {data.reviews_count} reviews</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Overall;
