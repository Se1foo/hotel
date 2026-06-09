import { connectDatabase } from './config/database';
import { env } from './config/env';
import { createApp } from './app';
import { seedDatabase } from './utils/seed';

export async function startServer() {
  await connectDatabase(env.mongoUri);
  await seedDatabase();

  const app = createApp();
  return app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}
