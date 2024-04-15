import { projectServices } from './project.services';

export type ProjectChannels = {
  [key in keyof typeof projectServices]: string;
};

export const projectChannels: ProjectChannels = {
  getProjects: 'project:getProjects',
  addProject: 'project:addProject',
  updateProject: 'project:updateProject',
  deleteProject: 'project:deleteProject',
  getProjectById: 'project:getProjectById',
};
