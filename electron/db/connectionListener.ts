import { app, ipcMain } from 'electron';
import fs from 'fs/promises';
import path from 'node:path';
import { Connection } from './types/connection';
import { init } from './config';
export const localPath = path.join(app.getPath('userData'));

export const connectionListeners = () => {
  ipcMain.handle('connect', async (_event, arg: Connection) => {
    const dbConfigPath = path.join(localPath, 'dbConfig.json');
    try {
      await fs.writeFile(dbConfigPath, JSON.stringify(arg));
      console.log('db config saved');
      console.log(path.join(localPath, 'dbConfig.json'));

      const res = await init();
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      const error = e as Error;
      return {
        success: false,
        message: 'db config save failed' + error.message,
      };
    }
  });
  ipcMain.handle('disconnect', async () => {
    const dbConfigPath = path.join(localPath, 'dbConfig.json');
    try {
      await fs.unlink(dbConfigPath);
      console.log('db config deleted');
      return {
        success: true,
        message: 'db config deleted',
      };
    } catch (e) {
      console.log(e);
      const error = e as Error;
      return {
        success: false,
        message: 'db config delete failed' + error.message,
      };
    }
  });

  ipcMain.handle('get:connection', async () => {
    const dbConfigPath = path.join(localPath, 'dbConfig.json');
    try {
      const dbConfig = await fs.readFile(dbConfigPath, 'utf-8');
      const connection = JSON.parse(dbConfig) as Connection;
      // return connection without password
      return {
        host: connection.host,
        port: connection.port,
        user: connection.user,
        database: connection.database,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  });
};
