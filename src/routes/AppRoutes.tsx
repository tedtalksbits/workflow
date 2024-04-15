import { AppLayout } from '@/components/layout/AppLayout';
import { Route, Routes } from 'react-router-dom';
import { LandingRoute } from './LandingRoute';
import { RouteProtector } from './RouteProtector';
import { Login, Register } from '@/routes/Auth';
import { Dashboard, NotFound } from '@/routes/Dashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path='/' element={<LandingRoute redirectTo='/dashboard' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/dashboard'
          element={
            <RouteProtector>
              <Dashboard />
            </RouteProtector>
          }
        />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};
