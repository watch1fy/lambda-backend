import mongoose from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { ensureModelsInit } from '../mongo/index.js';
import dotenv from 'dotenv'

dotenv.config()
mongoose.connect(process.env.MONGO_URL as string);

// Ensuring that every mongoose model is initialized
ensureModelsInit();

// Mongoose adapter to be used with lucia for auth
export const adapter = new MongodbAdapter(
  mongoose.connection.collection('sessions'),
  mongoose.connection.collection('users')
);
