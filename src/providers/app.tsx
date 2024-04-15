import React from 'react';
import { ThemeProvider } from './themeProvider';
import { Toaster } from 'sonner';
import { AuthProvider } from './authProvider';
import { MemoryRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { LoopIcon } from '@radix-ui/react-icons';
import { HomeIcon } from 'lucide-react';
type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: (...args: Array<unknown>) => void;
};
const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps): JSX.Element => {
  console.log(error);
  return (
    <div className='flex flex-col items-center justify-center h-full space-y-4'>
      <div className='text-3xl font-bold leading-loose'>Error</div>
      <img
        src={
          'https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1713052800&semt=sph'
        }
      />
      <div className='text-lg font-medium'>Oops! Something went wrong.</div>
      <div className='flex gap-4'>
        <Button variant='secondary' onClick={resetErrorBoundary}>
          <LoopIcon className='h-4 w-4 mr-2' /> Try again
        </Button>
        <Button
          onClick={() => {
            window.location.assign('/');
          }}
        >
          <HomeIcon className='h-4 w-4 mr-2' /> Go home
        </Button>
      </div>
    </div>
  );
};
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthProvider>
          <ThemeProvider defaultTheme='system' storageKey='workflow-theme'>
            <MemoryRouter>{children}</MemoryRouter>
            <Toaster richColors closeButton />
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
