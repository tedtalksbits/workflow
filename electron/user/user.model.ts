import { IUser } from '@/types/user';
import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    username: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    avatar: {
      type: String,
      required: false,
      default: null,
    },
    totalXP: {
      type: Number,
      required: false,
      default: 0,
    },
    level: {
      type: Number,
      required: false,
      default: 1,
    },
    preferences: {
      type: Object,
      required: false,
      default: {
        theme: 'light',
        deckView: 'list',
        cardView: 'list',
      },
    },
  },
  { timestamps: true }
);

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc, ret) {
    delete ret._id;
  },
});

userSchema.set('toObject', {
  virtuals: true,
  transform: function (_doc, ret) {
    delete ret._id;
  },
});
