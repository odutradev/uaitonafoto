import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, OAuthProvider, updateProfile, signOut } from 'firebase/auth'
import { useCallback, useEffect } from 'react'

import { syncAuthUser } from '@services/auth/sync'
import { firebaseAuth } from '@lib/firebase/config'
import useAuthStore from '@stores/auth'

import type { RegisterCredentials, LoginCredentials, UseAuthReturn } from './types'
import type { User } from 'firebase/auth'

const useAuth = (): UseAuthReturn => {
  const { setAuthUser, setLoading, clearAuth, setToken, auth } = useAuthStore()

  const handleSync = useCallback(
    async (firebaseUser: User, providerId?: string, overrideName?: string) => {
      const firebaseToken = await firebaseUser.getIdToken()
      const payload = {
        authProviderId: providerId ?? firebaseUser.providerData[0]?.providerId ?? 'password',
        name: overrideName ?? firebaseUser.displayName ?? 'Unknown',
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
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (!currentUser) {
        clearAuth()
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
    const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password)
    await handleSync(user, 'password')
  }

  const registerWithEmail = async ({ password, email, name }: RegisterCredentials) => {
    const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password)
    await updateProfile(user, { displayName: name })
    await handleSync(user, 'password', name)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const { user } = await signInWithPopup(firebaseAuth, provider)
    await handleSync(user, 'google.com')
  }

  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com')
    const { user } = await signInWithPopup(firebaseAuth, provider)
    await handleSync(user, 'apple.com')
  }

  const logout = async () => {
    setLoading(true)
    await signOut(firebaseAuth)
    clearAuth()
  }

  return {
    registerWithEmail,
    loginWithGoogle,
    loginWithApple,
    loginWithEmail,
    loading: auth.loading,
    user: auth.user,
    logout
  }
}

export default useAuth