import { AuthContext } from '@/providers/authProvider';
import { useContext } from 'react';

export const useAuth = () => {
  return useContext(AuthContext);
};
