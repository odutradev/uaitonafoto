import getErrorShape from '@utils/errorShape'
import { getFirebaseAuth } from './index'

import type { AuthActionCodeSettings, AuthCreateUserRequest, AuthDecodedIdToken, AuthDeleteUsersResult, AuthListUsersResult, AuthSessionCookieOptions, AuthUpdateUserRequest, AuthUserRecord, DeleteUserOptions, GetUserOptions } from './types'
import type * as admin from 'firebase-admin'

export const verifyIdToken = async (
  token: string,
  checkRevoked: boolean = false
): Promise<AuthDecodedIdToken> => {
  const auth = getFirebaseAuth()
  return auth.verifyIdToken(token, checkRevoked)
}

export const getUser = async (
  uid: string,
  options?: GetUserOptions
): Promise<AuthUserRecord | null> => {
  try {
    const auth = getFirebaseAuth()
    return await auth.getUser(uid)
  } catch (error) {
    const { code } = getErrorShape(error)
    if (!options?.throwOnNotFound && code === 'auth/user-not-found') {
      return null
    }
    throw error
  }
}

export const getUserByEmail = async (
  email: string,
  options?: GetUserOptions
): Promise<AuthUserRecord | null> => {
  try {
    const auth = getFirebaseAuth()
    return await auth.getUserByEmail(email)
  } catch (error) {
    const { code } = getErrorShape(error)
    if (!options?.throwOnNotFound && code === 'auth/user-not-found') {
      return null
    }
    throw error
  }
}

export const getUserByPhoneNumber = async (
  phoneNumber: string,
  options?: GetUserOptions
): Promise<AuthUserRecord | null> => {
  try {
    const auth = getFirebaseAuth()
    return await auth.getUserByPhoneNumber(phoneNumber)
  } catch (error) {
    const { code } = getErrorShape(error)
    if (!options?.throwOnNotFound && code === 'auth/user-not-found') {
      return null
    }
    throw error
  }
}

export const createUser = async (
  properties: AuthCreateUserRequest
): Promise<AuthUserRecord> => {
  const auth = getFirebaseAuth()
  return auth.createUser(properties)
}

export const updateUser = async (
  uid: string,
  properties: AuthUpdateUserRequest
): Promise<AuthUserRecord> => {
  const auth = getFirebaseAuth()
  return auth.updateUser(uid, properties)
}

export const deleteUser = async (
  uid: string,
  options?: DeleteUserOptions
): Promise<boolean> => {
  const auth = getFirebaseAuth()
  const ignoreNotFound = options?.ignoreNotFound ?? true

  try {
    await auth.deleteUser(uid)
    return true
  } catch (error) {
    const { code } = getErrorShape(error)
    if (ignoreNotFound && code === 'auth/user-not-found') {
      return false
    }
    throw error
  }
}

export const deleteUsers = async (
  uids: string[]
): Promise<AuthDeleteUsersResult> => {
  const auth = getFirebaseAuth()
  return auth.deleteUsers(uids)
}

export const setCustomUserClaims = async (
  uid: string,
  customClaims: Record<string, unknown> | null
): Promise<void> => {
  const auth = getFirebaseAuth()
  await auth.setCustomUserClaims(uid, customClaims)
}

export const getCustomUserClaims = async (
  uid: string
): Promise<Record<string, unknown> | null> => {
  const user = await getUser(uid)
  return (user?.customClaims as Record<string, unknown>) ?? null
}

export const createCustomToken = async (
  uid: string,
  developerClaims?: object
): Promise<string> => {
  const auth = getFirebaseAuth()
  return auth.createCustomToken(uid, developerClaims)
}

export const revokeRefreshTokens = async (uid: string): Promise<void> => {
  const auth = getFirebaseAuth()
  await auth.revokeRefreshTokens(uid)
}

export const listUsers = async (
  maxResults?: number,
  pageToken?: string
): Promise<AuthListUsersResult> => {
  const auth = getFirebaseAuth()
  return auth.listUsers(maxResults, pageToken)
}

export const generatePasswordResetLink = async (
  email: string,
  actionCodeSettings?: AuthActionCodeSettings
): Promise<string> => {
  const auth = getFirebaseAuth()
  return auth.generatePasswordResetLink(email, actionCodeSettings)
}

export const generateEmailVerificationLink = async (
  email: string,
  actionCodeSettings?: AuthActionCodeSettings
): Promise<string> => {
  const auth = getFirebaseAuth()
  return auth.generateEmailVerificationLink(email, actionCodeSettings)
}

export const generateSignInWithEmailLink = async (
  email: string,
  actionCodeSettings: AuthActionCodeSettings
): Promise<string> => {
  const auth = getFirebaseAuth()
  return auth.generateSignInWithEmailLink(email, actionCodeSettings)
}

export const createSessionCookie = async (
  idToken: string,
  options: AuthSessionCookieOptions
): Promise<string> => {
  const auth = getFirebaseAuth()
  return auth.createSessionCookie(idToken, options)
}

export const verifySessionCookie = async (
  sessionCookie: string,
  checkRevoked: boolean = false
): Promise<AuthDecodedIdToken> => {
  const auth = getFirebaseAuth()
  return auth.verifySessionCookie(sessionCookie, checkRevoked)
}

export const authUtils = {
  verifyIdToken,
  getUser,
  getUserByEmail,
  getUserByPhoneNumber,
  createUser,
  updateUser,
  deleteUser,
  deleteUsers,
  setCustomUserClaims,
  getCustomUserClaims,
  createCustomToken,
  revokeRefreshTokens,
  listUsers,
  generatePasswordResetLink,
  generateEmailVerificationLink,
  generateSignInWithEmailLink,
  createSessionCookie,
  verifySessionCookie
}

