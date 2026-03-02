import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/cards': {
        target: 'http://localhost:3001'
      },
      '/images': {
        target: 'http://localhost:3001'
      }
    }
  }
})