import React from 'react';
import { ThemeProvider } from './themeProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider defaultTheme='system' storageKey='workflow-theme'>
        {children}
      </ThemeProvider>
    </React.Suspense>
  );
};
