import mongoose from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { ensureModelsInit } from '../mongo/index.js';

mongoose.connect(process.env.MONGO_URL as string || 'mongodb+srv://admin:isZTWk3PeU959eV@cluster0.itmdno7.mongodb.net/watchify?retryWrites=true&w=majority&appName=Cluster0');

ensureModelsInit();

export const adapter = new MongodbAdapter(
  mongoose.connection.collection('sessions'),
  mongoose.connection.collection('users')
);
