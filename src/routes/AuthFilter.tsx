import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthFilter = () => {
  const { user } = useAuth();
  console.log('user', user);
  if (!user) {
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};
