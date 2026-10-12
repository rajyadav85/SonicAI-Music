import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const saavnProxy = {
  '/api/saavn': {
    target: 'https://www.jiosaavn.com',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api\/saavn/, ''),
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Referer: 'https://www.jiosaavn.com/',
    },
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: saavnProxy,
  },
  preview: {
    proxy: saavnProxy,
  },
});
