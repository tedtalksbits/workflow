import { useConfig } from '@/hooks/useConfig';
import { Connection } from 'electron/db/connection';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthFilter = () => {
  const [config, setConfig] = useState<Connection | null>(null);
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get:connection:sync');
    window.electron.ipcRenderer.once('get:connection:sync:reply', (data) => {
      console.log(data);
      console.log('get:connection:sync:reply');
      setConfig(data as Connection);
    });
    console.log('authfilter page');
  }, []);
  const hasValidConfig = config?.user && config?.host && config?.database;

  // if (!hasValidConfig) {
  //   console.log('user is logged in');
  //   return <Navigate to='/login' />;
  // }

  // return <Outlet />;
  console.log('authfilter page');
  return <>{!hasValidConfig ? <Navigate to='/login' /> : <Outlet />}</>;
};
