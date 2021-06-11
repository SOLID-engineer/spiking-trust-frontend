/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import BusinessSelector from '../../slices/business/selector';

const withCompany = (WrappedComponent) => (props) => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  if (currentCompany === null) return null;
  return <WrappedComponent {...props} />;
};

export default withCompany;
