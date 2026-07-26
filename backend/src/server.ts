import type { Server } from 'http';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';
import { createApp } from './app';
import { seedDatabase } from './utils/seed';

export async function startServer(): Promise<Server> {
  await connectDatabase(env.mongoUri);
  await seedDatabase();

  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`[server] Listening on port ${env.port} (${env.nodeEnv}).`);
  });

  registerShutdownHandlers(server);
  return server;
}

/**
 * Graceful shutdown. Without this, a container stop killed the process mid-flight
 * — in-flight requests were dropped and the Mongo connection was never closed.
 */
function registerShutdownHandlers(server: Server): void {
  let shuttingDown = false;

  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[server] ${signal} received, shutting down.`);

    // Stop accepting new connections, then drain the existing ones.
    server.close(async (error) => {
      if (error) console.error('[server] Error while closing:', error);
      try {
        await disconnectDatabase();
      } catch (dbError) {
        console.error('[server] Error closing the database connection:', dbError);
      }
      process.exit(error ? 1 : 0);
    });

    // Don't hang forever on a stuck keep-alive connection.
    setTimeout(() => {
      console.error('[server] Forced exit after 10s shutdown timeout.');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  // An unhandled rejection leaves the process in an undefined state; log it and
  // shut down cleanly rather than continuing to serve traffic.
  process.on('unhandledRejection', (reason) => {
    console.error('[server] Unhandled promise rejection:', reason);
    void shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (error) => {
    console.error('[server] Uncaught exception:', error);
    void shutdown('uncaughtException');
  });
}
