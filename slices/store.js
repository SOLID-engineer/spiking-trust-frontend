import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import sessionSlice from './session';
import businessSlice from './business';

const store = configureStore({
  reducer: {
    [sessionSlice.name]: sessionSlice.reducer,
    [businessSlice.name]: businessSlice.reducer,
  },
  middleware: getDefaultMiddleware({
    thunk: true,
    immutableCheck: true,
  }),
});

export default store;
