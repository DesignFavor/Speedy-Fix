import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/send-email': 'http://localhost:3001',  // Proxy API requests to backend server
    }
  }
})
