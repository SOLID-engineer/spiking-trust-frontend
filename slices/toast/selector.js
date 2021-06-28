const getToast = (state) => state.toast || {};
const getToastList = (state) => getToast(state).list;
const ToastSelector = { getToast, getToastList };

export default ToastSelector;
