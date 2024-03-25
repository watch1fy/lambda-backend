import mongoose from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { ensureModelsInit } from '../mongo';

mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL as string);

ensureModelsInit();

export const adapter = new MongodbAdapter(
  mongoose.connection.collection('sessions'),
  mongoose.connection.collection('users')
);
