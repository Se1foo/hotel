import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Kept separate from `vite.config.ts`: Vitest ships its own nested Vite, and
 * mixing the two `defineConfig` types produces an unresolvable plugin-type
 * conflict against Vite 8.
 *
 * The suite covers pure logic modules — calendar maths, formatters, filter and
 * sort behaviour — so no React plugin or DOM environment is needed.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    passWithNoTests: false,
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.test.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
