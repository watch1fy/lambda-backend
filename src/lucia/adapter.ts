import mongoose from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { ensureModelsInit } from '../mongo/index.js';
import dotenv from 'dotenv'

dotenv.config()
mongoose.connect(process.env.MONGO_URL as string);

ensureModelsInit();

export const adapter = new MongodbAdapter(
  mongoose.connection.collection('sessions'),
  mongoose.connection.collection('users')
);
