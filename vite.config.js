import { defineConfig } from 'vite';

export default defineConfig({
  // Standard Vite defaults - these are explicit for clarity
  root: '.',
  publicDir: 'public',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,

    rollupOptions: {
      output: {
        // Standard naming conventions with content hashing
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
