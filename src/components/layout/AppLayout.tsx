import { Link, NavLink, Outlet } from 'react-router-dom';
import { Logo } from '../logo/Logo';
import { AuthMenu } from '@/routes/Auth/components/AuthMenu';

export const AppLayout = () => {
  return (
    <main className='app-wrapper'>
      <Outlet />
    </main>
  );
};
