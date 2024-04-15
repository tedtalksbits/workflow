import { themeServices } from './theme.services';

export type ThemeChannels = {
  [key in keyof typeof themeServices]: string;
};

export const themeChannels: ThemeChannels = {
  toggleTheme: 'theme:toggleTheme',
  setTheme: 'theme:setTheme',
  getTheme: 'theme:getTheme',
  setSystemTheme: 'theme:setSystemTheme',
};
