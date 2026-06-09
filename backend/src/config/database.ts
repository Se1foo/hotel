import mongoose from 'mongoose';

export async function connectDatabase(mongoUri: string): Promise<void> {
  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB successfully.`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}
