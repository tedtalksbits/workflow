import { userServices } from './user.services';

export type UserChannels = {
  [key in keyof typeof userServices]: string;
};

export const userChannels: UserChannels = {
  login: 'user:logIn',
  register: 'user:signUp',
  loginLocal: 'user:loginLocal',
  logOut: 'user:logOut',
  getUser: 'user:getUser',
  getUsers: 'user:getUsers',
};
