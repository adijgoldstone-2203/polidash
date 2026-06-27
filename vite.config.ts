import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_PRE_PRODUCTION': JSON.stringify(process.env.VERCEL_ENV !== 'production')
  },
  server: {
    proxy: {
      '/2022/tiles': {
        target: 'https://elections.kaplanopensource.co.il',
        changeOrigin: true,
        secure: false
      },
      '/tiles': {
        target: 'https://elections.kaplanopensource.co.il',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('framer-motion')) return 'vendor-motion';
            return 'vendor-core';
          }
        }
      }
    }
  }
})

