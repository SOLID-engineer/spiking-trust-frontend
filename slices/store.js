import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { nextReduxCookieMiddleware, wrapMakeStore } from 'next-redux-cookie-wrapper';
import sessionSlice from './session';
import businessSlice from './business';

const store = configureStore({
  reducer: {
    [sessionSlice.name]: sessionSlice.reducer,
    [businessSlice.name]: businessSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      nextReduxCookieMiddleware({
        subtrees: ['session'],
      })
    ),
});

const makeStore = wrapMakeStore(() => store);
export const wrapper = createWrapper(makeStore, { debug: true });

export default store;
