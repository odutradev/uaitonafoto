import type * as admin from 'firebase-admin'

export type AuthUserRecord = admin.auth.UserRecord
export type AuthDecodedIdToken = admin.auth.DecodedIdToken
export type AuthCreateUserRequest = admin.auth.CreateRequest
export type AuthUpdateUserRequest = admin.auth.UpdateRequest
export type AuthActionCodeSettings = admin.auth.ActionCodeSettings
export type AuthListUsersResult = admin.auth.ListUsersResult
export type AuthDeleteUsersResult = admin.auth.DeleteUsersResult
export type AuthSessionCookieOptions = admin.auth.SessionCookieOptions

export interface GetUserOptions {
  throwOnNotFound?: boolean
}

export interface DeleteUserOptions {
  ignoreNotFound?: boolean
}

