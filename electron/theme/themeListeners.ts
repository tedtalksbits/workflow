import { ipcMain } from 'electron';
import { themeServices } from './theme.services';
import { themeChannels } from './theme.channels';

export const themeListerners = () => {
  /*
  ========================================
  DARK MODE
  ========================================
*/
  ipcMain.handle(themeChannels.toggleTheme, themeServices.toggleTheme);

  ipcMain.handle(themeChannels.setSystemTheme, themeServices.setSystemTheme);
};
