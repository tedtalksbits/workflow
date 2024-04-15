import { appListeners } from './app/appListeners';
import { projectListeners } from './project/projectListeners';
import { tasksListeners } from './task/taskListeners';
import { themeListerners } from './theme/themeListeners';
import { userlisteners } from './user/userListeners';

export const setUpIpcListeners = () => {
  projectListeners();
  userlisteners();
  tasksListeners();
  // connectionListeners();
  appListeners();
  themeListerners();
};
