import mongoose from 'mongoose';
import { ITask } from '../../src/types/task';
export const taskSchema = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ['todo', 'inProgress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    projectId: { type: String, required: true, ref: 'Project' },
    tags: { type: String, required: false },
    assignee: { type: String, required: false },
    isRecurring: { type: Boolean, required: true, default: false },
    eventName: { type: String, required: false },
  },
  { timestamps: true }
);

taskSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

taskSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

taskSchema.set('toObject', {
  virtuals: true,
  transform: function (_doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});
