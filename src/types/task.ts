export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  tags: string;
  owner: string;
  assignee: string;
  dueDate: string;
  projectId: string;
};

export type TaskStatus = 'todo' | 'inProgress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

type StatusColors = {
  [key in TaskStatus]: string;
};
type PriorityColors = {
  [key in TaskPriority]: string;
};

export const statusColors: StatusColors = {
  done: 'bg-green-500/40',
  inProgress: 'bg-gray-500/40',
  todo: 'bg-primary/40',
};
export const priorityColors: PriorityColors = {
  low: 'bg-green-500/40',
  medium: 'bg-yellow-500/40',
  high: 'bg-red-500/40',
};
