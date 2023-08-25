import { ipcMain } from 'electron';
import respository from './respository';

export const userListeners = () => {
  ipcMain.handle('get:users', async (_event, arg) => {
    const data = await respository.selectAll();
    return data;
  });
};
