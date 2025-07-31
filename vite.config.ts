import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from "node:path";
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    laravel({
      input: 'src/app.tsx',
      refresh: true,
    }),
    react(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
