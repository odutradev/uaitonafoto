import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'

import { isProduction } from '@config/default'

import type { Auth } from 'firebase/auth'
import type { FirebaseStorage } from 'firebase/storage'
import type { Analytics } from 'firebase/analytics'

const firebaseConfig = {
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.trim() !== '' &&
  firebaseConfig.apiKey !== 'undefined'
)

let authInstance: Auth | null = null
let storageInstance: FirebaseStorage | null = null
let analyticsInstance: Analytics | null = null

if (isFirebaseConfigured) {
  try {
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
    authInstance = getAuth(app)
    storageInstance = getStorage(app)

    if (isProduction && typeof window !== 'undefined' && firebaseConfig.measurementId) {
      isSupported().then((supported) => {
        if (supported) {
          analyticsInstance = getAnalytics(app)
        }
      }).catch(() => {})
    }
  } catch (error) {
    console.warn('[Firebase] Falha ao inicializar com as credenciais:', error)
  }
} else {
  console.info('[Firebase] Credenciais não configuradas. Modo de visualização ativo.')
}

export const firebaseAuth = authInstance
export const firebaseStorage = storageInstance
export const firebaseAnalytics = analyticsInstance

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (isProduction && analyticsInstance) {
    try {
      logEvent(analyticsInstance, eventName, params)
    } catch {
      // Ignora bloqueadores de tracking
    }
  }
}
