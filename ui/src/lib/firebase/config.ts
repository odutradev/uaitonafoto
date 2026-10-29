import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

import type { Auth } from 'firebase/auth'

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

if (isFirebaseConfigured) {
  try {
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
    authInstance = getAuth(app)
  } catch (error) {
    console.warn('[Firebase] Falha ao inicializar com as credenciais:', error)
  }
} else {
  console.info('[Firebase] Credenciais não configuradas. Modo de visualização ativo.')
}

export const firebaseAuth = authInstance
