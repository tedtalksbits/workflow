import { repository } from './users.repository';

export const userServices = {
  async login({ name, password }: LoginProps) {
    if (!name || !password) {
      throw new Error('name and password are required');
    }

    const user = await repository.select(['*'], { name });
    if (!user) {
      throw new Error('User not found');
    }

    const data = await repository.select(['*'], { name, password });
    if (!data) {
      throw new Error('Incorrect credentials');
    }
    return data;
  },

  async register({ name, password }: RegisterProps) {
    if (!name || !password) {
      throw new Error('name and password are required');
    }

    const user = await repository.select(['*'], { name });
    if (user) {
      throw new Error('User already exists');
    }

    const data = await repository.insert({ name, password });

    return data;
  },

  async getUser({ id }: { id: number }) {
    if (!id) {
      throw new Error('id is required');
    }

    const data = await repository.select(['*'], { id });

    return data;
  },
};

type LoginProps = {
  name: string;
  password: string;
};

type RegisterProps = {
  name: string;
  password: string;
};
