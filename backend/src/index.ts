import { startServer } from './server';

startServer().catch((error) => {
  console.error('[server] Failed to start:', error);
  process.exit(1);
});
