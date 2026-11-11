import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut
} from 'firebase/auth'
import { useCallback, useEffect } from 'react'

import { syncAuthUser } from '@actions/auth'
import { firebaseAuth } from '@utils/functions/firebase'
import useAuthStore from '@stores/auth'

import type { RegisterCredentials, LoginCredentials, UseAuthReturn } from './types'
import type { User } from 'firebase/auth'

interface PendingRegistration {
  email: string
  name: string
}

let pendingRegistration: PendingRegistration | null = null

const useAuth = (): UseAuthReturn => {
  const { setAuthUser, setLoading, clearAuth, setToken, auth } = useAuthStore()

  const handleSync = useCallback(
    async (firebaseUser: User, providerId?: string, overrideName?: string) => {
      const isKnown = (val?: string | null) =>
        !!val && val.trim().length > 0 && val.trim().toLowerCase() !== 'unknown'

      const resolveDisplayName = (): string => {
        if (isKnown(overrideName)) return overrideName!.trim()
        if (isKnown(firebaseUser.displayName)) return firebaseUser.displayName!.trim()
        if (
          pendingRegistration &&
          firebaseUser.email &&
          pendingRegistration.email === firebaseUser.email.toLowerCase()
        ) {
          return pendingRegistration.name
        }
        const currentStoreUser = useAuthStore.getState().auth.user
        if (isKnown(currentStoreUser?.name)) return currentStoreUser!.name.trim()
        if (isKnown(currentStoreUser?.fullName)) return currentStoreUser!.fullName!.trim()
        if (firebaseUser.email) {
          const prefix = firebaseUser.email.split('@')[0]
          if (prefix) return prefix
        }
        return 'Usuário'
      }

      const resolvedName = resolveDisplayName()
      const firebaseToken = await firebaseUser.getIdToken()
      const payload = {
        authProviderId: providerId ?? firebaseUser.providerData[0]?.providerId ?? 'password',
        name: resolvedName,
        fullName: resolvedName !== 'Usuário' ? resolvedName : undefined,
        email: firebaseUser.email ?? '',
        photoUrl: firebaseUser.photoURL ?? undefined,
        id: firebaseUser.uid,
        firebaseToken
      }
      const { token, user } = await syncAuthUser(payload)
      setToken(token)
      setAuthUser(user)
    },
    [setAuthUser, setToken]
  )

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (!currentUser) {
        clearAuth()
        return
      }

      if (
        pendingRegistration &&
        currentUser.email &&
        pendingRegistration.email === currentUser.email.toLowerCase()
      ) {
        return
      }

      const currentStoreUser = useAuthStore.getState().auth.user
      if (!currentStoreUser || currentStoreUser.email !== currentUser.email) {
        try {
          await handleSync(currentUser)
        } catch {
          clearAuth()
        }
      } else {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [handleSync, clearAuth, setLoading])

  const loginWithEmail = async ({ email, password }: LoginCredentials) => {
    if (!firebaseAuth) {
      throw new Error('Firebase não configurado. Adicione as credenciais no .env para autenticar.')
    }
    const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password)
    await handleSync(user, 'password')
  }

  const registerWithEmail = async ({ password, email, name }: RegisterCredentials) => {
    if (!firebaseAuth) {
      throw new Error('Firebase não configurado. Adicione as credenciais no .env para autenticar.')
    }
    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()
    pendingRegistration = { email: cleanEmail, name: cleanName }

    try {
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, cleanEmail, password)
      await updateProfile(user, { displayName: cleanName })
      await handleSync(user, 'password', cleanName)
    } finally {
      pendingRegistration = null
    }
  }

  const loginWithGoogle = async () => {
    if (!firebaseAuth) {
      throw new Error('Firebase não configurado. Adicione as credenciais no .env para autenticar.')
    }
    const provider = new GoogleAuthProvider()
    const { user } = await signInWithPopup(firebaseAuth, provider)
    await handleSync(user, 'google.com')
  }

  const logout = async () => {
    if (!firebaseAuth) {
      clearAuth()
      return
    }
    setLoading(true)
    await signOut(firebaseAuth)
    clearAuth()
  }

  return {
    registerWithEmail,
    loginWithGoogle,
    loginWithEmail,
    loading: auth.loading,
    user: auth.user,
    logout
  }
}

export default useAuth
