export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string | undefined;
  avatar: string;
  totalXP: number;
  level: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  deckView: 'list' | 'grid';
  cardView: 'list' | 'grid';
}

export type UserCredentials = {
  username: string;
  password: string;
  userId: string;
};
