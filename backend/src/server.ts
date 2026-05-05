import { connectDatabase } from './config/database';
import { env } from './config/env';
import { createApp } from './app';

export async function startServer() {
  await connectDatabase(env.mongoUri);

  const app = createApp();
  return app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}
