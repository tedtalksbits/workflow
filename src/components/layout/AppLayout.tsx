import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <main className='app-wrapper'>
      <Outlet />
    </main>
  );
};
