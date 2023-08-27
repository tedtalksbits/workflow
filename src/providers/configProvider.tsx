import { Connection } from 'electron/db/types/connection';
import React, { createContext, useEffect, useState } from 'react';

type ConfigContextType = {
  config: Connection | null;
  setConfig: React.Dispatch<React.SetStateAction<Connection | null>>;
};

export const ConfigContext = createContext<ConfigContextType>({
  config: null,
  setConfig: () => console.warn('no config'),
});

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<Connection | null>(
    localStorage.getItem('config')
      ? JSON.parse(localStorage.getItem('config') || '')
      : null
  );

  useEffect(() => {
    const getConfig = async () => {
      const res = await window.electron.ipcRenderer.invoke('get:connection');
      localStorage.setItem('config', JSON.stringify(res));
      setConfig(res);
    };
    getConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
