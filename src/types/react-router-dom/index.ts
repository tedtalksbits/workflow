import { Location } from 'react-router-dom';

export type LocationState = {
  from?: Location;
  request?: 'register' | 'login';
  emptyDecks?: boolean;
};

export type AppPaths = [
  '/',
  '/login',
  '/register',
  '/decks',
  '/decks/:id',
  '/decks/:id/edit',
  '/decks/:id/study'
];
