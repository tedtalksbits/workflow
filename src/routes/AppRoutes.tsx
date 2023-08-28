import { AppProvider } from '@/providers/app';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './Auth/Login';
import { Dashboard } from './Dashboard/Dashboard';
import { useEffect, useState } from 'react';

export const AppRoutes = () => {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    console.log('config effect ran');
    const getConfig = async () => {
      const res = await window.electron.ipcRenderer.invoke('get:connection');
      localStorage.setItem('config', JSON.stringify(res));
      setConfig(res);
    };
    getConfig();
  }, []);
  return (
    <AppProvider>
      <Router>{config ? <AuthRoutes /> : <NoAuthRoutes />}</Router>
    </AppProvider>
  );
};

const NoAuthRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
    </Routes>
  );
};

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  );
};
