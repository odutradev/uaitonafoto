import fs from 'fs'
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const resolveAppVersion = (): string => {
  const candidates = [
    path.resolve(__dirname, 'uaitonafoto-package.json'),
    path.resolve(__dirname, '../uaitonafoto-package.json'),
    path.resolve(__dirname, '../package.json'),
    path.resolve(process.cwd(), 'uaitonafoto-package.json'),
    path.resolve(process.cwd(), '../uaitonafoto-package.json'),
    path.resolve(process.cwd(), 'package.json')
  ]

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8'))
        if (parsed.name === 'uaitonafoto' && parsed.version) {
          return parsed.version
        }
        if (parsed.version && !parsed.name?.includes('api') && !parsed.name?.includes('ui')) {
          return parsed.version
        }
      }
    } catch {}
  }

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8'))
        if (parsed.version) {
          return parsed.version
        }
      }
    } catch {}
  }

  return '1.0.0'
}

const appVersion = resolveAppVersion()

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion)
  },
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
      '@actions': path.resolve(__dirname, './src/api/actions'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@config': path.resolve(__dirname, './src/config'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@interceptor': path.resolve(__dirname, './src/api/interceptor'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/chunks/[name]-[hash].js',
        entryFileNames: 'assets/entries/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) return id.toString().split('node_modules/')[1].split('/')[0]
        }
      }
    }
  },
  server: {
    port: 1000,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }
  }
})
