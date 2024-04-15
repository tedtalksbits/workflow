import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}
export const PageLayout = ({ children }: PageLayoutProps) => {
  return <section className='p-4 animate-fade-in'>{children}</section>;
};
