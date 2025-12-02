import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TrashIAFrontend/',
  build: {
    // Dividir el bundle en chunks más pequeños
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        }
      }
    },
    // Comprimir assets
    assetsInlineLimit: 4096, // 4kb - inline pequeños assets
    chunkSizeWarningLimit: 500, // Advertir si un chunk > 500kb
  },
  // Optimizar dependencias en desarrollo
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
