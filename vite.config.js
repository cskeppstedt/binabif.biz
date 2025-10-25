import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  // Standard Vite defaults - these are explicit for clarity
  root: '.',
  publicDir: 'public',

  plugins: [
    // Optimize images during build
    viteImagemin({
      gifsicle: false,
      mozjpeg: false,
      optipng: {
        optimizationLevel: 7, // 0-7, higher = more compression
      },
      pngquant: false,
      svgo: false,
      webp: {
        quality: 85, // 0-100, higher = better quality
      },
    }),
  ],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,

    // Explicitly enable HTML minification
    minify: 'esbuild', // or 'terser' for more aggressive minification

    rollupOptions: {
      output: {
        // Standard naming conventions with content hashing
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',

        // Manual chunk splitting - separate vendor from app code
        manualChunks: (id) => {
          // Put all node_modules code into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Everything else goes into the default chunk
        },
      },
    },
  },
});
