import { AuthContext } from '@/providers/authProvider';
import { useContext } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('useAuth must be use within a AuthProvider');
  return context;
};
