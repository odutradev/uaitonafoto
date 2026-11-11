import path from 'path'
import fs from 'fs'

import type { PackageJsonVersion } from './types'

const DefaultVersion = '1.0.0'

const VersionCandidates = [
  path.resolve(process.cwd(), 'uaitonafoto-package.json'),
  path.resolve(process.cwd(), '../uaitonafoto-package.json'),
  path.resolve(process.cwd(), 'package.json'),
  path.resolve(process.cwd(), '../package.json'),
  path.resolve(__dirname, '../../../../package.json'),
  path.resolve(__dirname, '../../../package.json')
]

const readPackageJson = (candidate: string): PackageJsonVersion | null => {
  try {
    if (!fs.existsSync(candidate)) return null
    return JSON.parse(fs.readFileSync(candidate, 'utf-8')) as PackageJsonVersion
  } catch {
    return null
  }
}

const isRootPackage = (parsed: PackageJsonVersion): boolean => {
  if (parsed.name === 'uaitonafoto' && parsed.version) return true
  return Boolean(parsed.version && !parsed.name?.includes('api') && !parsed.name?.includes('ui'))
}

export const resolveAppVersion = (): string => {
  const packages = VersionCandidates.map(readPackageJson).filter((parsed): parsed is PackageJsonVersion => parsed !== null)
  const rootPackage = packages.find(isRootPackage)
  const fallbackPackage = packages.find((parsed) => Boolean(parsed.version))
  return rootPackage?.version ?? fallbackPackage?.version ?? DefaultVersion
}

const resolvedVersion = resolveAppVersion()

export const getAppVersion = (): string => {
  if (resolvedVersion === DefaultVersion) return resolveAppVersion()
  return resolvedVersion
}

export const version = getAppVersion()

export * from './types'
export default resolveAppVersion
