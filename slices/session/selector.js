const getSession = (state) => state.session || {};
const getUser = (state) => getSession(state).user;
const isAuthenticated = (state) => getSession(state).isAuthenticated;
const SessionSelector = { getSession, getUser, isAuthenticated };

export default SessionSelector;
