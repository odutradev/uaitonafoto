import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const requiredVars: string[] = []

  requiredVars.forEach((key) => {
    if (!env[key]) throw new Error(chalk.red(`The environment variable ${chalk.bold(key)} is not defined.`))
  })

  const getPackageVersion = (): string => {
    try {
      const dockerPkg = path.resolve(__dirname, 'root-package.json')
      if (fs.existsSync(dockerPkg)) {
        const pkg = JSON.parse(fs.readFileSync(dockerPkg, 'utf-8'))
        if (pkg.version) return pkg.version
      }
    } catch {}

    try {
      const rootPkg = path.resolve(__dirname, '../package.json')
      if (fs.existsSync(rootPkg)) {
        const pkg = JSON.parse(fs.readFileSync(rootPkg, 'utf-8'))
        if (pkg.version) return pkg.version
      }
    } catch {}

    try {
      const localPkg = path.resolve(__dirname, 'package.json')
      if (fs.existsSync(localPkg)) {
        const pkg = JSON.parse(fs.readFileSync(localPkg, 'utf-8'))
        if (pkg.version) return pkg.version
      }
    } catch {}

    return '1.0.0'
  }

  const appVersion = getPackageVersion()

  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion)
    },
    plugins: [react()],
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
        input: {
          index: path.resolve(__dirname, 'index.html')
        },
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
    publicDir: 'public',
    server: {
      port: 1000,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
      }
    }
  }
})