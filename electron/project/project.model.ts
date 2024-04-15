import { IProject } from '@/types/projects';
import mongoose from 'mongoose';

export const projectSchema = new mongoose.Schema<IProject>(
  {
    name: { type: String, required: true },
    icon: { type: String, required: false },
    description: { type: String, required: false },
    tags: { type: String, required: false },
    members: { type: [String], required: false },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  { timestamps: true }
);

projectSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

projectSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

projectSchema.set('toObject', {
  virtuals: true,
  transform: function (_doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});
