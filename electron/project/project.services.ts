import { IProject } from '@/types/projects';
import { projectController } from './project.controller';

export const projectServices = {
  async getProjects() {
    return await projectController.getProjects();
  },
  async addProject(project: Partial<IProject>) {
    return await projectController.addProject(project);
  },
  async updateProject(id: string, project: Partial<IProject>) {
    return await projectController.updateProject(id, project);
  },
  async deleteProject(id: string) {
    return await projectController.deleteProject(id);
  },
  async getProjectById(id: string) {
    return await projectController.getProjectById(id);
  },
};
