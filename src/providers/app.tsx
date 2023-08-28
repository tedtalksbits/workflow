import React from 'react';
import { ThemeProvider } from './themeProvider';
import { Toaster } from '@/components/ui/toaster';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider defaultTheme='system' storageKey='workflow-theme'>
        {children}
        <Toaster />
      </ThemeProvider>
    </React.Suspense>
  );
};
