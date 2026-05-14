import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API requests to FastAPI backend during development
    // This avoids CORS issues when frontend and backend run on different ports
    proxy: {
      '/books': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/borrowers': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
