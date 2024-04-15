import { taskServices } from './task.services';

export type TaskChannels = {
  [key in keyof typeof taskServices]: string;
};

export const taskChannels: TaskChannels = {
  createTask: 'task:createTask',
  updateTask: 'task:updateTask',
  deleteTask: 'task:deleteTask',
  getTasksByProjectId: 'task:getTasksByProjectId',
  addRecurringTask: 'task:addRecurringTask',
};
