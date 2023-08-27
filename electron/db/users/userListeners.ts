import { ipcMain } from 'electron';
import { repository } from './users.repository';
import { userServices } from './users.services';

export const userListeners = () => {
  ipcMain.handle('get:users', async () => {
    const data = await repository.selectAll();
    return data;
  });

  ipcMain.handle('register:user', async (_event, arg) => {
    const data = await userServices.register(arg);
    return data;
  });

  ipcMain.handle('login:user', async (_event, arg) => {
    const data = await userServices.login(arg);
    return data;
  });
};
