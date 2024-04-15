import { nativeTheme } from 'electron';

const toggleTheme = () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  return nativeTheme.shouldUseDarkColors;
};

const setTheme = (theme: 'light' | 'dark') => {
  nativeTheme.themeSource = theme;
};

const getTheme = () => {
  return nativeTheme.shouldUseDarkColors;
};

const setSystemTheme = () => {
  nativeTheme.themeSource = 'system';
};

export const themeServices = {
  toggleTheme,
  setTheme,
  getTheme,
  setSystemTheme,
};
