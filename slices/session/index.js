/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    reset: () => initialState,
    loginSuccess: (state, action) => {
      const { accessToken } = action.payload;
      state.isAuthenticated = true;
      state.accessToken = accessToken;
    },
    getUserSuccess: (state, action) => {
      state.user = action.payload;
    },
    logout: () => initialState,
  },
  extraReducers: {
    [HYDRATE]: (state, action) => ({
      ...state,
      ...action.payload.session,
    }),
  },
});

export const { reset, logout, loginSuccess, getUserSuccess } = sessionSlice.actions;

export const getUser = () => async (dispatch) => {
  try {
    const response = await axios.get('/me');
    dispatch(getUserSuccess(response.data));
  } catch (error) {}
};

export default sessionSlice;
