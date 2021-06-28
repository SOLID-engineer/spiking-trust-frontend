import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import sessionSlice from './session';
import businessSlice from './business';
import toastSlice from './toast';

const store = configureStore({
  reducer: {
    [sessionSlice.name]: sessionSlice.reducer,
    [businessSlice.name]: businessSlice.reducer,
    [toastSlice.name]: toastSlice.reducer,
  },
  middleware: getDefaultMiddleware({
    thunk: true,
    immutableCheck: true,
  }),
});

export default store;
