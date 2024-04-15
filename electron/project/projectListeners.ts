import { ipcMain } from 'electron';
import { projectChannels } from './project.channels';
import { projectServices } from './project.services';

export const projectListeners = () => {
  ipcMain.handle(
    projectChannels.getProjects,
    async (_event, ...args: Parameters<typeof projectServices.addProject>) => {
      console.log(projectChannels.getProjects, args);
      return await projectServices.getProjects();
    }
  );

  ipcMain.handle(
    projectChannels.addProject,
    async (_event, ...args: Parameters<typeof projectServices.addProject>) => {
      console.log(projectChannels.addProject, args);
      return await projectServices.addProject(...args);
    }
  );

  ipcMain.handle(
    projectChannels.updateProject,
    async (
      _event,
      ...args: Parameters<typeof projectServices.updateProject>
    ) => {
      console.log(projectChannels.updateProject, args);
      return await projectServices.updateProject(...args);
    }
  );

  ipcMain.handle(
    projectChannels.deleteProject,
    async (
      _event,
      ...args: Parameters<typeof projectServices.deleteProject>
    ) => {
      console.log(projectChannels.deleteProject, args);
      return await projectServices.deleteProject(...args);
    }
  );
};
