import { ITask } from '@/types/task';
import { taskController } from './task.controller';

export const taskServices = {
  createTask: async (projectId: string, task: Partial<ITask>) => {
    return await taskController.addTask(projectId, task);
  },
  updateTask: async (id: string, task: Partial<ITask>) => {
    return await taskController.updateTask(id, task);
  },
  deleteTask: async (id: string) => {
    return await taskController.deleteTask(id);
  },
  getTasksByProjectId: async (projectId: string) => {
    return await taskController.getTasksProjectId(projectId);
  },
  addRecurringTask: async (
    projectId: string,
    task: Partial<ITask>,
    startDate: string,
    frequency: string
  ) => {
    return await taskController.addRecurringTask(
      projectId,
      task,
      startDate,
      frequency
    );
  },
};
