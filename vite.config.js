import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Duas páginas: a landing (/) e a política de privacidade (/privacidade/)
    rollupOptions: {
      input: {
        principal: 'index.html',
        privacidade: 'privacidade/index.html',
      },
    },
  },
})
