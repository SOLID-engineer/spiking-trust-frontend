import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import SessionSelector from '../../slices/session/selector';

const AuthRoute = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(SessionSelector.isAuthenticated);
  const { returnUrl } = router.query;
  if (isAuthenticated) {
    router.push(returnUrl || '/');
  }
  return children;
};

export default AuthRoute;
