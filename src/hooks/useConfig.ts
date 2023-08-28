import { Connection } from 'electron/db/types/connection';
import { useCallback, useEffect } from 'react';

type UseConfig = (callback: (config: Connection) => void) => void;
export const useConfig: UseConfig = (callback) => {
  const getConfigCallback = useCallback(async () => {
    const res = (await window.electron.ipcRenderer.invoke(
      'get:connection'
    )) as Connection;
    localStorage.setItem('config', JSON.stringify(res));
    callback(res);
  }, [callback]);

  useEffect(() => {
    console.log('config effect ran');
    getConfigCallback();
  }, [getConfigCallback]);
};

export default useConfig;
