import { connectDatabase } from './config/database';
import { env } from './config/env';
import { seedDatabase } from './utils/seed';
import mongoose from 'mongoose';

const run = async () => {
  await connectDatabase(env.mongoUri);
  await seedDatabase();
  await mongoose.disconnect();
  console.log('Seed runner completed.');
};

run();
