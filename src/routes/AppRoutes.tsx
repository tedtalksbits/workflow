import { AppProvider } from '@/providers/app';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard/Dashboard';
import { AuthFilter } from './AuthFilter';
import { Login } from './Auth/Login';
import { useConfig } from '@/hooks/useConfig';

export const AppRoutes = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<div>About</div>} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

const Home = () => {
  // window.electron.ipcRenderer.sendMessage('get:connection:sync');
  // window.electron.ipcRenderer.once('get:connection:sync:reply', (data) => {
  //   console.log(data);
  //   console.log('get:connection:sync:reply');
  // });
  // console.log('authfilter page');
  const { config } = useConfig();

  return <>hello {JSON.stringify(config)}</>;
};
