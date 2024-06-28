import mongoose from 'mongoose';
import { SessionSchema } from './session.js';
import { UserSchema } from './user.js';
import { PartySchema } from './party.js';
import { MessageSchema } from './message.js';

function ensureModelsInit(): void {
  mongoose.models.User || mongoose.model('User', UserSchema);
  mongoose.models.Session || mongoose.model('Session', SessionSchema);
  mongoose.models.Party || mongoose.model('Party', PartySchema);
  mongoose.models.Message || mongoose.model('Message', MessageSchema);
}

export default ensureModelsInit;
