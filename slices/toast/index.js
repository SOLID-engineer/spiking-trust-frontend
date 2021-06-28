/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { list } = state;
      if (!list.some((item) => item.message === action.payload.message))
        state.list = [...list, { ...action.payload, show: true }];
    },
    hideToast: (state, action) => {
      const { list } = state;
      state.list = list.map((item) => {
        if (item.key === action.payload) return { ...item, show: false };
        return item;
      });
    },
    removeToast: (state, action) => {
      const { list } = state;
      state.list = list.filter((item) => item.key !== action.payload);
    },
    clear: (state) => {
      state.list = initialState.list;
    },
  },
});

export const { addToast, hideToast, removeToast, clear } = toastSlice.actions;

export default toastSlice;
