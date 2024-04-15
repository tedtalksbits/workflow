import { IProject } from '@/types/projects';
import { Project } from '../mongodb/schemas';

export const projectController = {
  getProjects: async () => {
    try {
      const data = await Project.find().populate('tasks').exec();
      if (data.length === 0) {
        return {
          message: 'No projects found',
          success: false,
          data: [],
        };
      }
      return {
        message: 'Projects found',
        success: true,
        data: data.map((project) => project.toObject()),
      };
    } catch (error) {
      console.log(error);
      return {
        messaage: 'Failed to get projects',
        success: false,
        data: [],
      };
    }
  },
  addProject: async (project: Partial<IProject>) => {
    // handle early returns for invalid data
    if (!project) {
      return {
        message: 'Project data is required',
        success: false,
        data: [],
      };
    }
    if (!project.name) {
      return {
        message: 'Project name is required',
        success: false,
        data: [],
      };
    }
    try {
      await Project.create(project);
      // return all projects
      const allProjects = await Project.find().populate('tasks').exec();
      return {
        message: 'Project created successfully',
        success: true,
        data: allProjects.map((project) => project.toObject()),
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to create project',
        success: false,
        data: [],
      };
    }
  },
  updateProject: async (id: string, project: Partial<IProject>) => {
    // handle early returns for invalid data
    if (!id) {
      return {
        message: 'Project ID is required',
        success: false,
        data: [],
      };
    }
    if (!project) {
      return {
        message: 'Project data is required',
        success: false,
        data: [],
      };
    }
    if (!project.name) {
      return {
        message: 'Project name is required',
        success: false,
        data: [],
      };
    }
    try {
      // update the project
      // new:true returns the updated project
      // .populate('tasks') returns the tasks associated with the project
      const updatedProject = await Project.findByIdAndUpdate(
        {
          _id: id,
        },
        project,
        {
          new: true,
        }
      )
        .populate('tasks')
        .exec();

      if (!updatedProject) {
        return {
          message: 'Project not found',
          success: false,
          data: [],
        };
      }
      const allProjects = await Project.find().populate('tasks').exec();
      return {
        message: 'Project updated successfully',
        success: true,
        data: allProjects.map((project) => project.toObject()),
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to update project',
        success: false,
        data: [],
      };
    }
  },
  deleteProject: async (id: string) => {
    // handle early returns for invalid data
    if (!id) {
      return {
        message: 'Project ID is required',
        success: false,
        data: [],
      };
    }
    try {
      // delete the project
      const deletedProject = await Project.findByIdAndDelete({
        _id: id,
      });
      if (!deletedProject) {
        return {
          message: 'Project not found',
          success: false,
          data: [],
        };
      }
      const allProjects = await Project.find().populate('tasks').exec();
      return {
        message: 'Project deleted successfully',
        success: true,
        data: allProjects.map((project) => project.toObject()),
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to delete project',
        success: false,
        data: [],
      };
    }
  },
  getProjectById: async (id: string) => {
    // handle early returns for invalid data
    if (!id) {
      return {
        message: 'Project ID is required',
        success: false,
        data: {},
      };
    }
    try {
      const data = await Project.findById(id).populate('tasks').exec();
      if (!data) {
        return {
          message: 'Project not found',
          success: false,
          data: {},
        };
      }
      return {
        message: 'Project found',
        success: true,
        data: data,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to get project',
        success: false,
        data: {},
      };
    }
  },
};
