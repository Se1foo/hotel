import mongoose from 'mongoose';

export async function connectDatabase(mongoUri: string): Promise<void> {
  // Fail fast instead of buffering queries for 30s behind an unreachable server.
  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10_000,
  });

  console.log('[db] Connected to MongoDB.');

  // Connection drops after startup are recoverable; the driver retries on its
  // own, so these are logged rather than fatal.
  mongoose.connection.on('error', (error) => {
    console.error('[db] Connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] Disconnected from MongoDB.');
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  console.log('[db] Connection closed.');
}
