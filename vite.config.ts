import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      routes: path.resolve(__dirname, 'src/routes'),
      screens: path.resolve(__dirname, 'src/screens'),
      '@': path.resolve(__dirname, 'src')
    }
  }
});
