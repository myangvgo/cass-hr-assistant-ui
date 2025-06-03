import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/chat': {
        target: 'http://aaa.xyxy234.cn/half_query', // Adjust the target to your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ''), // Rewrite the path if necessary
        secure: false, // If your backend uses HTTPS, set this to true
      }
    }
  }
})
