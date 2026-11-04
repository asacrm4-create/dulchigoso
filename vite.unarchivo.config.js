import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Genera la página completa en UN solo archivo HTML (para verla sin servidor).
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'vista-previa', assetsInlineLimit: 100000000, chunkSizeWarningLimit: 100000 },
})
