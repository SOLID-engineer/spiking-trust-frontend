import React from 'react';
import { Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import ToastSelector from 'slices/toast/selector';
import { hideToast, removeToast } from 'slices/toast';
import { TYPE_DEFAULT, TYPE_ERROR, TYPE_INFO, TYPE_SUCCESS, TYPE_WARNING } from 'utils/toast';

const ToastContainer = () => {
  const toastList = useSelector(ToastSelector.getToastList);
  const dispatch = useDispatch();

  const renderToast = (item) => {
    let classes = 'bg-gray-200 text-gray-800 border-gray-400';
    switch (item.type) {
      case TYPE_SUCCESS:
        classes = 'bg-green-200 text-green-800 border-green-400';
        break;
      case TYPE_ERROR:
        classes = 'bg-red-200 text-red-800 border-red-400';
        break;
      case TYPE_INFO:
        classes = 'bg-blue-200 text-blue-800 border-blue-400';
        break;
      case TYPE_WARNING:
        classes = 'bg-yellow-200 text-yellow-800 border-yellow-400';
        break;
      case TYPE_DEFAULT:
      default:
        break;
    }

    return (
      <Transition
        key={item.key}
        show={item.show}
        appear
        enter="transition-transform transform ease-in-out duration-300"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform transform ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        afterEnter={() => {
          setTimeout(() => {
            dispatch(hideToast(item.key));
          }, item.duration);
        }}
        afterLeave={() => {
          dispatch(removeToast(item.key));
        }}
        onClick={() => {
          dispatch(hideToast(item.key));
        }}
        className={`p-4 mb-2 border relative ${classes}`}
        role="button"
        aria-hidden="true"
      >
        <>
          <div className="w-4 h-4 absolute top-2 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div>{item.message}</div>
        </>
      </Transition>
    );
  };

  return (
    <div className="fixed top-4 right-4 left-4 lg:left-auto lg:w-80 z-50">
      <div className="flex flex-col">{toastList.map(renderToast)}</div>
    </div>
  );
};

export default ToastContainer;
