import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://timmy1o1.pythonanywhere.com',
        changeOrigin: true,
      }
    }
  }
})
