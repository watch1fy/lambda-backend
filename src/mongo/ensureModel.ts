import mongoose from 'mongoose';
import { SessionSchema } from './session.js';
import { UserSchema } from './user.js';

function ensureModelsInit(): void {
  mongoose.models.User || mongoose.model('User', UserSchema);
  mongoose.models.Session || mongoose.model('Session', SessionSchema);
}

export default ensureModelsInit;
