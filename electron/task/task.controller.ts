import { ITask } from '@/types/task';
import { Project, Task } from '../mongodb/schemas';

export const taskController = {
  addTask: async (projectId: string, task: Partial<ITask>) => {
    // handle early returns for invalid data
    if (!projectId) {
      return {
        message: 'Project ID is required',
        success: false,
        data: {},
      };
    }
    if (!task.title || !task.dueDate) {
      return {
        message: 'Title and due date are required',
        success: false,
        data: {},
      };
    }
    try {
      // create a new task
      task.projectId = projectId;
      const newTask = await Task.create(task);

      // add the task to the project
      await Project.findByIdAndUpdate(projectId, {
        $push: { tasks: newTask._id },
      });

      return {
        message: 'Task added successfully',
        success: true,
        data: newTask.toObject(),
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to add task',
        success: false,
        data: {},
      };
    }
  },
  updateTask: async (id: string, task: Partial<ITask>) => {
    console.log('updateTask controller', id, task);
    // handle early returns for invalid data
    if (!id) {
      return {
        message: 'Task ID is required',
        success: false,
        data: [],
      };
    }

    try {
      // update the task
      // new:true returns the updated task
      const updatedTask = await Task.findByIdAndUpdate({ _id: id }, task, {
        new: true,
      });

      // if updatedTask is null, the task was not found
      if (!updatedTask) {
        return {
          message: 'Task not found',
          success: false,
          data: [],
        };
      }
      const projectId = updatedTask.projectId;
      console.log('projectId', projectId);
      const allTasks = await Task.find({ projectId });
      return {
        message: 'Task updated successfully',
        success: true,
        data: allTasks.map((task) => task.toObject()),
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to update task',
        success: false,
        data: [],
      };
    }
  },
  deleteTask: async (id: string) => {
    // handle early returns for invalid data
    if (!id) {
      return {
        message: 'Task ID is required',
        success: false,
        data: {},
      };
    }
    try {
      // delete the task
      const deletedTask = await Task.findByIdAndDelete({
        _id: id,
      });
      // if deletedTask is null, the task was not found
      if (!deletedTask) {
        return {
          message: 'Task not found',
          success: false,
          data: {},
        };
      }

      return {
        message: 'Task deleted successfully',
        success: true,
        data: deletedTask.toObject(),
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to delete task',
        success: false,
        data: {},
      };
    }
  },
  getTasksProjectId: async (projectId: string) => {
    // handle early returns for invalid data
    if (!projectId) {
      return {
        message: 'Project ID is required',
        success: false,
        data: [],
      };
    }

    try {
      // fetch tasks by project ID
      // populate the projectId field with the project details
      const data = await Task.find({ projectId }).populate('projectId').exec();

      // if data is null, the project was not found
      if (!data) {
        return {
          message: 'Tasks not found',
          success: false,
          data: [],
        };
      }
      return {
        message: 'Tasks fetched successfully',
        success: true,
        data: data.map((task) => task.toObject()),
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to fetch tasks',
        success: false,
        data: [],
      };
    }
  },
  addRecurringTask: async (
    projectId: string,
    task: Partial<ITask>,
    startDate: string,
    frequency: string
  ) => {
    throw new Error('Not implemented');
  },
};
