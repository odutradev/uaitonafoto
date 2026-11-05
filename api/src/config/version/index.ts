import path from 'path'
import fs from 'fs'

import type { PackageJsonVersion } from './types'

let appVersion = '1.0.0'

export const resolveAppVersion = (): string => {
  const candidates = [
    path.resolve(process.cwd(), 'uaitonafoto-package.json'),
    path.resolve(process.cwd(), '../uaitonafoto-package.json'),
    path.resolve(process.cwd(), 'package.json'),
    path.resolve(process.cwd(), '../package.json'),
    path.resolve(__dirname, '../../../../package.json'),
    path.resolve(__dirname, '../../../package.json')
  ]

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as PackageJsonVersion
        if (parsed.name === 'uaitonafoto' && parsed.version) {
          appVersion = parsed.version
          return appVersion
        }
        if (parsed.version && !parsed.name?.includes('api') && !parsed.name?.includes('ui')) {
          appVersion = parsed.version
          return appVersion
        }
      }
    } catch {}
  }

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as PackageJsonVersion
        if (parsed.version) {
          appVersion = parsed.version
          return appVersion
        }
      }
    } catch {}
  }

  return appVersion
}

appVersion = resolveAppVersion()

export const getAppVersion = (): string => {
  if (appVersion === '1.0.0') {
    return resolveAppVersion()
  }
  return appVersion
}

export const version = getAppVersion()

export * from './types'
export default resolveAppVersion
