import mongoose from 'mongoose';
import { config } from '../config';

// Connect to MongoDB.
export const connectDB = async () => {
  try {
    await mongoose.connect(config.db.uri);
    console.log('MongoDB connected.');
  } catch (error) {
    console.error(error);
  }
};
