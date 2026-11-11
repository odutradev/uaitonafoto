import env from '@config/env'

export const buildFrontendUrl = (path = ''): string => `${env.FRONTEND_URL.replace(/\/+$/, '')}${path}`
