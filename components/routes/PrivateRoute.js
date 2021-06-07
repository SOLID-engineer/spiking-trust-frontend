import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import SessionSelector from '../../slices/session/selector';

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(SessionSelector.isAuthenticated);
  if (!isAuthenticated) {
    router.push(`/login?returnUrl=${window.location.pathname}${window.location.search}`);
  }
  return children;
};

export default PrivateRoute;
