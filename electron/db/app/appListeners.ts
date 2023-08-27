import { app, ipcMain } from 'electron';
import os from 'os';

export const appListeners = () => {
  ipcMain.handle('get:systemInfo', async () => {
    const platform = process.platform;
    const user = os.userInfo().username;
    const home = os.homedir();
    const hostname = os.hostname();
    const type = os.type();
    const release = os.release();
    const env = app.isPackaged ? 'production' : 'development';
    const data: SystemInfo = {
      platform,
      user,
      home,
      hostname,
      type,
      release,
      env,
    };
    return data;
  });
};

export type SystemInfo = {
  platform: NodeJS.Platform;
  user: string;
  home: string;
  hostname: string;
  type: string;
  release: string;
  env: string;
};
