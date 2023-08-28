export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
  tags: string;
  assignee: string;
  dueDate: Date | null;
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
  inProgress: 'bg-primary/40',
  todo: 'bg-foreground/40',
};
export const priorityColors: PriorityColors = {
  low: 'bg-green-500/40',
  medium: 'bg-yellow-500/40',
  high: 'bg-red-500/40',
};
