import mongoose from 'mongoose';
import { SessionSchema } from './session';
import { UserSchema } from './user';

function ensureModelsInit(): void {
  mongoose.models.User || mongoose.model('User', UserSchema);
  mongoose.models.Session || mongoose.model('Session', SessionSchema);
}

export default ensureModelsInit;
