import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: React.ReactNode;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  element
}) => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((s) => s.user);

  if (!isAuthenticated) {
    return null;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: string })?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return element;
};
