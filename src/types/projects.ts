import { ITask } from './task';

export type IProject = {
  name: string;
  icon: string;
  description: string;
  id: string;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
  members: string[];
  tasks: ITask[];
};
