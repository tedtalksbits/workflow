import mongoose from 'mongoose';
import { userSchema } from '../../user/user.model';
import { projectSchema } from '../../project/project.model';
import { taskSchema } from '../../task/task.model';

export const User = mongoose.model('User', userSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Task = mongoose.model('Task', taskSchema);
