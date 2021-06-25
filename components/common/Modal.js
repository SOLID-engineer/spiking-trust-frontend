import { Transition } from '@headlessui/react';
import React from 'react';

const Modal = ({ children, isVisible, onClose }) => (
  <>
    <Transition
      show={isVisible}
      unmount={false}
      className="fixed z-50 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-center items-center min-h-screen px-4">
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount={false}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></Transition.Child>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          unmount={false}
          className="sm:inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all max-w-xl w-full "
        >
          <div className="bg-white p-4 dark:bg-gray-900">{children}</div>
        </Transition.Child>
      </div>
    </Transition>
  </>
);

export default Modal;
