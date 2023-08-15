import React from 'react';
import { ThemeProvider } from './themeProvider';
import { AuthProvider } from './authProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <ThemeProvider defaultTheme='system' storageKey='workflow-theme'>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </React.Suspense>
  );
};
