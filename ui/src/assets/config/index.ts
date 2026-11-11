import packageJson from '../../../package.json'

interface DefaultConfig {
  mode: 'developing' | 'production'
  baseURL: string
  version: string
}

export const isProduction = import.meta.env.PROD || import.meta.env.VITE_PRODUCTION === 'true'
const rawBaseURL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'
const normalizedBaseURL = rawBaseURL.replace(/^(https?):\/([^/])/, '$1://$2')
const baseURL = normalizedBaseURL.replace(/\/+$/, '')

const appVersion = import.meta.env.VITE_APP_VERSION || packageJson.version

const defaultConfig: DefaultConfig = {
  version: appVersion,
  mode: isProduction ? 'production' : 'developing',
  baseURL,
}

export const version = appVersion

export default defaultConfig