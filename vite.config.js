import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: replace 'kingshot-advisor' with your actual GitHub repo name
// Example: if your repo URL is github.com/Mridanc2/my-app → base: '/my-app/'
export default defineConfig({
  plugins: [react()],
  base: '/kingshot-advisor/',
  build: {
    outDir: 'dist',
  },
});
