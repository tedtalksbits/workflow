import { AppProvider } from '@/providers/app';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthFilter } from './AuthFilter';
import { Login } from './Auth/Login';
import { Dashboard } from './Dashboard/Dashboard';

export const AppRoutes = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route element={<AuthFilter />}>
            <Route path='/' element={<Dashboard />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<div>About</div>} />
        </Routes>
      </Router>
    </AppProvider>
  );
};
