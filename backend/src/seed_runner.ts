import { connectDB } from './config/database';
import { seedDatabase } from './utils/seed';
import mongoose from 'mongoose';

const run = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.disconnect();
  console.log('Seed runner completed.');
};

run();
