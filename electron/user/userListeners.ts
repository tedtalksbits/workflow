import { ipcMain } from 'electron';
import { userChannels } from './user.channels';
import { userController } from './user.controller';

export const userlisteners = () => {
  ipcMain.handle(
    userChannels.login,
    async (_event, ...args: Parameters<typeof userController.logIn>) => {
      console.log(userChannels.login, args);
      return await userController.logIn(...args);
    }
  );
  ipcMain.handle(
    userChannels.register,
    async (_event, ...args: Parameters<typeof userController.signUp>) => {
      console.log(userChannels.register, args);
      return await userController.signUp(...args);
    }
  );
  ipcMain.handle(
    userChannels.loginLocal,
    async (_event, ...args: Parameters<typeof userController.loginLocal>) => {
      console.log(userChannels.loginLocal, args);
      return await userController.loginLocal(...args);
    }
  );

  ipcMain.handle(
    userChannels.logOut,
    async (_event, ...args: Parameters<typeof userController.logOut>) => {
      console.log(userChannels.logOut, args);
      return await userController.logOut(...args);
    }
  );

  ipcMain.handle(
    userChannels.getUser,
    async (_event, ...args: Parameters<typeof userController.getUser>) => {
      console.log(userChannels.getUser, args);
      return await userController.getUser(...args);
    }
  );

  ipcMain.handle(
    userChannels.getUsers,
    async (_event, ...args: Parameters<typeof userController.getUsers>) => {
      console.log(userChannels.getUsers, args);
      return await userController.getUsers(...args);
    }
  );
};
