import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/CPU_Scheduler/',
  resolve: {
    alias: { '@': '/src' },
  },
});
