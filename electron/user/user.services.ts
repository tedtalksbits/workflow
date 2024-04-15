import { userController } from './user.controller';
import { IUser } from '@/types/user';

export const userServices = {
  async login({ username, password }: { username: string; password: string }) {
    return await userController.logIn({ username, password });
  },

  async register(req: Partial<IUser>) {
    return await userController.signUp(req);
  },

  async getUser({ id }: { id: number }) {
    return await userController.getUser({ id });
  },

  async getUsers() {
    return await userController.getUsers();
  },

  async logOut() {
    return await userController.logOut();
  },

  async loginLocal() {
    return await userController.loginLocal();
  },
};
