import mongoose from 'mongoose';
import { IUser } from '../types/index.js';

export const UserSchema = new mongoose.Schema<IUser>(
  {
    _id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      required: true
    }
  } as const,
  { _id: false }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
