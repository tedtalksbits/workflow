import { Connection } from 'electron/db/connection';
import React, { createContext, useEffect, useState } from 'react';

type ConfigContextType = {
  config: Connection | null;
};

export const ConfigContext = createContext<ConfigContextType>({
  config: null,
});

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<Connection | null>(null);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get:connection:sync');
    window.electron.ipcRenderer.once('get:connection:sync:reply', (data) => {
      console.log(data);
      console.log('get:connection:sync:reply');
      setConfig(data as Connection);
    });
  }, []);

  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
};
