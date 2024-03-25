import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    userGuestId: {
      type: String,
      required: true,
    },
  } as const,
  { _id: false }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
