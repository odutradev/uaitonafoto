import path from 'path'
import fs from 'fs'

let appVersion = '1.0.0'

export const resolveAppVersion = (): string => {
  const candidates = [
    path.resolve(process.cwd(), 'uaitonafoto-package.json'),
    path.resolve(process.cwd(), '../package.json')
  ]

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as { version?: string }
        if (parsed.version) {
          appVersion = parsed.version
          return appVersion
        }
      }
    } catch {}
  }

  return appVersion
}

export const getAppVersion = (): string => appVersion

export default resolveAppVersion
