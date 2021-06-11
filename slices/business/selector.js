/* eslint-disable import/no-extraneous-dependencies */
import { createSelector } from 'reselect';

const getBusiness = (state) => state.business || {};
const selectCompanies = createSelector([getBusiness], (business) => business.companies);
const selectCurrentCompany = createSelector([getBusiness], (business) => business.currentCompany);

const BusinessSelector = { getBusiness, selectCompanies, selectCurrentCompany };

export default BusinessSelector;
