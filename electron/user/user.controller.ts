import { IUser } from '@/types/user';
import { User } from '../mongodb/schemas';
import CryptoJS from 'crypto-js';
import { config } from '../config';
import {
  getUserCreds,
  removeUserCreds,
  storeUserCreds,
} from '../utils/localUserCreds';

export const userController = {
  getUser: async ({ id }: { id: number }) => {
    if (!id) {
      throw new Error('id is required');
    }

    const data = await User.findOne({ _id: id }).exec();

    return data;
  },
  getUsers: async () => {
    const data = await User.find().exec();
    return data;
  },
  logIn: async (credentials: { username: string; password: string }) => {
    console.log('logIn', credentials);
    const { username, password } = credentials;

    if (!username || !password) {
      return {
        message: 'Please provide a username and password.',
        success: false,
        data: null,
      };
    }

    const user = await User.findOne({ username }).exec();
    console.log('user', user);
    if (!user) {
      return {
        message: 'No user found with that username',
        success: false,
        data: null,
      };
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password as string,
      config.app.secret
    ).toString(CryptoJS.enc.Utf8);

    console.log('decryptedPassword', decryptedPassword);

    if (decryptedPassword !== password) {
      return {
        message: 'No user found with that username and password.',
        success: false,
        data: null,
      };
    }
    storeUserCreds({
      username,
      password,
      userId: user._id.toString(),
    });
    return {
      message: 'User logged in successfully.',
      success: true,
      data: {
        ...user.toObject(),
        password: undefined,
      },
    };
  },
  signUp: async (req: Partial<IUser>) => {
    console.log('signUp', req);
    const { username, password, email, firstName, lastName } = req;

    if (!username || !password || !email || !firstName || !lastName) {
      return {
        message: 'Please provide all required fields.',
        success: false,
        data: null,
      };
    }

    const foundUserByUsername = await User.findOne({ username }).exec();
    console.log('user', foundUserByUsername);
    if (foundUserByUsername) {
      return {
        message: 'A user with that username already exists.',
        success: false,
        data: null,
      };
    }

    const foundUserByEmail = await User.findOne({ email }).exec();
    console.log('user', foundUserByEmail);
    if (foundUserByEmail) {
      return {
        message: 'A user with that email already exists.',
        success: false,
        data: null,
      };
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      config.app.secret
    ).toString();

    const newUser = new User({
      ...req,
      password: encryptedPassword,
    });

    await newUser.save();
    storeUserCreds({ username, password, userId: newUser._id.toString() });

    return {
      message: 'User created successfully.',
      success: true,
      data: {
        ...newUser.toObject(),
        password: undefined,
      },
    };
  },
  logOut: async () => {
    removeUserCreds();
    return {
      message: 'User logged out successfully.',
      success: true,
      data: null,
    };
  },
  loginLocal: async () => {
    const userCreds = getUserCreds();
    if (!userCreds) {
      return {
        message: 'No local user found.',
        success: false,
        data: null,
      };
    }
    const { username, password } = userCreds;
    return await userController.logIn({ username, password });
  },
};
