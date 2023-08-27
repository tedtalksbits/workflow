import { ipcMain } from 'electron';
import { repository } from './project.repository';
import { Project } from '@/types/projects';

export const projectListeners = () => {
  ipcMain.handle('get:projects', async () => {
    const data = await repository.selectAll();
    return data;
  });

  ipcMain.handle('add:project', async (_event, project) => {
    await repository.insert(project);
    const data = await repository.selectAll();
    return data;
  });

  ipcMain.handle(
    'update:project',
    async (_event, id: number, project: Project) => {
      await repository.update(id, project);
      const data = await repository.selectAll();
      return data as Project[];
    }
  );

  ipcMain.handle('delete:project', async (_event, id: number) => {
    await repository.delete(id);
    const data = await repository.selectAll();
    return data;
  });
};
