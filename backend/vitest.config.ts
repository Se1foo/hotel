import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Provides JWT secrets before `config/env.ts` is imported, since that module
    // validates its input (and can exit the process) at import time.
    setupFiles: ['src/test/setup.ts'],
    passWithNoTests: false,
  },
});
