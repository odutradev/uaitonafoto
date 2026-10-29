import packageJson from '../../package.json'

interface DefaultConfig {
  mode: 'developing' | 'production'
  baseURL: string
  version: string
}

const isProduction = import.meta.env.PROD || import.meta.env.VITE_PRODUCTION === 'true'
const rawBaseURL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000'
const normalizedBaseURL = rawBaseURL.replace(/^(https?):\/([^/])/, '$1://$2')
const baseURL = normalizedBaseURL.replace(/\/+$/, '')

const defaultConfig: DefaultConfig = {
  version: packageJson.version,
  mode: isProduction ? 'production' : 'developing',
  baseURL,
}

export default defaultConfig