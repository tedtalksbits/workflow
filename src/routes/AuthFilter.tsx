import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthFilter = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};
