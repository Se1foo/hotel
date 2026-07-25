import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Test config lives in `vitest.config.ts`. Vitest bundles its own nested Vite,
// whose plugin types conflict with Vite 8's, so the two are kept separate.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Warn earlier than the 500 kB default so a dependency creeping into the
    // main chunk gets noticed.
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        /**
         * Splits heavy, rarely-changing vendor code out of the app chunk so a
         * content change doesn't invalidate React and the router in the
         * browser's cache.
         */
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('@tanstack')) return 'query';
          return undefined;
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
