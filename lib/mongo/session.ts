import { ISession } from '../types/index.js';
import mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema<ISession>(
  {
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
  } as const,
  { _id: false }
);

const Session =
  mongoose.models.Session || mongoose.model('Session', SessionSchema);

export default Session;
