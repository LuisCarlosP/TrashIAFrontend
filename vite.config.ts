import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/TrashIAFrontend/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        }
      }
    },
    assetsInlineLimit: 4096, 
    chunkSizeWarningLimit: 500, 
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
