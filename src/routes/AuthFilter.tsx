import { useConfig } from '@/hooks/useConfig';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthFilter = () => {
  // const localConfig = localStorage.getItem('config');

  // console.log(localConfig, 'localConfig');
  // if (!localConfig || !JSON.parse(localConfig).config) {
  //   return <Navigate to='/login' />;
  // }

  // return <Outlet />;

  const { config } = useConfig();

  if (!config) {
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};
