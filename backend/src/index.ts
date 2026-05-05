import { startServer } from './server';

startServer().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});