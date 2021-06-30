import store from 'slices/store';
import { addToast, clear } from 'slices/toast';
import { v4 as uuidv4 } from 'uuid';

export const TYPE_DEFAULT = 'default';
export const TYPE_SUCCESS = 'success';
export const TYPE_ERROR = 'error';
export const TYPE_INFO = 'info';
export const TYPE_WARNING = 'warning';

const defaultOptions = {
  type: TYPE_DEFAULT,
  duration: 3000,
};

const dispatchToast = (message, options) => {
  const toast = { key: uuidv4(), type: options.type, message, duration: options.duration };
  store.dispatch(addToast(toast));
};

const toast = (message, options) => {
  dispatchToast(message, {
    ...defaultOptions,
    ...options,
  });
};

toast.success = (message) => {
  toast(message, { type: TYPE_SUCCESS });
};

toast.error = (message) => {
  toast(message, { type: TYPE_ERROR });
};

toast.info = (message) => {
  toast(message, { type: TYPE_INFO });
};

toast.warning = (message) => {
  toast(message, { type: TYPE_WARNING });
};

toast.clear = () => {
  store.dispatch(clear());
};

export default toast;
