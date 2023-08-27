import { ipcMain } from 'electron';
import { repository } from './tasks.repository';

export const tasksListeners = () => {
  ipcMain.handle('get:tasks', async () => {
    const data = await repository.selectAll();
    return data;
  });

  ipcMain.handle('get:tasksByProjectId', async (_event, projectId) => {
    const data = await repository.select(['*'], { projectId });
    return data;
  });

  ipcMain.handle('add:task', async (_event, projectId: number, task) => {
    task.projectId = projectId;
    await repository.insert(task);
    const data = await repository.selectAll();
    return data;
  });

  ipcMain.handle('update:task', async (_event, id: number, task) => {
    await repository.update(id, task);
    const data = await repository.selectAll();
    return data;
  });

  ipcMain.handle('delete:task', async (_event, id: number) => {
    await repository.delete(id);
    const data = await repository.selectAll();
    return data;
  });
};
