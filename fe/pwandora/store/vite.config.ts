import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // plugins: [react(), tailwindcss()],
  base: '/store/',
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  define: {
    __BUILD_DATE__: JSON.stringify(
      new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
    ),
  },
  server: {
    headers: {
      'X-Frame-Options': 'ALLOWALL', // Allow embedding the page in an iframe from any origin
    },
    proxy: {
      '/dev': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev/, ''),
      },
    },
  },
})
