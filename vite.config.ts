// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import ts from '@rollup/plugin-typescript';

export default defineConfig({
  plugins: [
    ts({
      declaration: true,
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@mcasaresmdevz/netspective-universal-lib',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['astro'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          astro: 'Astro',
        },
      },
    },
  },
});
