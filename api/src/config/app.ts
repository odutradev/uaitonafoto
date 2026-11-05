import path from 'path'
import fs from 'fs'
import env from '@config/env'

export interface AppConfig {
  name: string
  title: string
  mode: string
  version: string
}

const resolvePackageVersion = (): string => {
  const candidates = [
    path.resolve(process.cwd(), 'root-package.json'),
    path.resolve(process.cwd(), '../package.json'),
    path.resolve(process.cwd(), 'package.json')
  ]

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as { version?: string }
        if (parsed.version) return parsed.version
      }
    } catch {}
  }

  return '1.0.0'
}

export const appConfig: AppConfig = {
  name: 'uaitonafoto',
  title: 'uai to na foto API Documentation',
  mode: env.NODE_ENV,
  version: resolvePackageVersion()
}

