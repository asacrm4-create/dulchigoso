import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base relativa: el sitio funciona en cualquier carpeta o dominio
export default defineConfig({
  base: './',
  plugins: [react()],
})
