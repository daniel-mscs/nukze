import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Páginas: a landing (/), a política (/privacidade/), o suporte (/suporte/) e o painel interno (/painel/)
    rollupOptions: {
      input: {
        principal: 'index.html',
        privacidade: 'privacidade/index.html',
        painel: 'painel/index.html',
        suporte: 'suporte/index.html',
      },
    },
  },
})
