/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const initialState = {
  companies: null,
  currentCompany: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    reset: () => initialState,
    getCompaniesSuccess: (state, action) => {
      state.companies = action.payload;
    },
    selectCompany: (state, action) => {
      state.currentCompany = action.payload;
    },
  },
});

export const { reset, getCompaniesSuccess, selectCompany } = businessSlice.actions;

export const getCompanies = () => async (dispatch) => {
  try {
    const response = await axios.get('/business/companies');
    dispatch(getCompaniesSuccess(response.data));
  } catch (error) {}
};

export default businessSlice;
