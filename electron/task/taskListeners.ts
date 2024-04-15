import { ipcMain } from 'electron';
import { taskServices } from './task.services';
import { taskChannels } from './task.channels';

export const tasksListeners = () => {
  ipcMain.handle(
    taskChannels.getTasksByProjectId,
    async (_event, projectId) => {
      return await taskServices.getTasksByProjectId(projectId);
    }
  );

  ipcMain.handle(
    taskChannels.createTask,
    async (_event, projectId: string, task) => {
      return await taskServices.createTask(projectId, task);
    }
  );

  ipcMain.handle(taskChannels.updateTask, async (_event, id: string, task) => {
    return await taskServices.updateTask(id, task);
  });

  ipcMain.handle(taskChannels.deleteTask, async (_event, id: string) => {
    return await taskServices.deleteTask(id);
  });

  ipcMain.handle(
    taskChannels.addRecurringTask,
    async (
      _event,
      projectId: string,
      task,
      startDate: string,
      frequency: string
    ) => {
      return await taskServices.addRecurringTask(
        projectId,
        task,
        startDate,
        frequency
      );
    }
  );
};
