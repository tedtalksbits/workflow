import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './routes/AppRoutes.tsx';
import './index.css';
import { AppProvider } from './providers/app.tsx';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');
