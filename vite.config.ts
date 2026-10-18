/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDocker = fs.existsSync('/.dockerenv');
  const defaultTarget = isDocker ? 'http://backend:8080' : 'http://localhost:8080';
  const backendTarget =
    env.BACKEND_URL ||
    env.VITE_PROXY_TARGET ||
    process.env.BACKEND_URL ||
    process.env.VITE_PROXY_TARGET ||
    defaultTarget;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  };
});
