import { appListeners } from './app/appListeners';
import { connectionListeners } from './connectionListener';
import { projectListeners } from './projects/projectsListeners';
import { tasksListeners } from './tasks/tasksListeners';
import { userListeners } from './users/userListeners';

export const setUpIpcListeners = () => {
  projectListeners();
  userListeners();
  tasksListeners();
  connectionListeners();
  appListeners();
};
