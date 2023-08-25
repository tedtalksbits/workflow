import { ConfigContext } from '@/providers/configProvider';
import { useContext } from 'react';

export const useConfig = () => {
  return useContext(ConfigContext);
};
