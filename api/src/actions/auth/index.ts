import jwt from 'jsonwebtoken'

import { forgotPasswordSchema, resetPasswordSchema, syncResponseSchema, updateUserSchema, syncUserSchema, userSchema } from './schemas'
import { passwordResetTemplate } from '@/email/templates/passwordReset'
import { authRateLimiter } from '@/middlewares/rateLimit'
import { getJwtSecret } from '@/config/env'
import { firebaseAuth } from '@/database/connection'
import userRepository from '@/repositories/user/index'
import logRepository from '@/repositories/log/index'
import defineAction from '@/factories/defineAction'

import type { ForgotPasswordRequest, ResetPasswordRequest, SyncUserResponse, UpdateUserRequest, SyncUserRequest, UserResponse } from './types'
import type { ManageRequestResponse, ManageRequestBody } from '@/middlewares/manageRequest/types'

interface PasswordResetTokenPayload {
  purpose: 'password-reset'
  email: string
  updatedAt?: string
  sub?: string
}

const resolveFrontendBaseUrl = (redirectUrl?: string, requestOrigin?: string): string => {
  const allowedConfig = process.env.CORS_ORIGIN || process.env.CORS_ALLOWED_ORIGINS || ''
  const allowedOrigins = allowedConfig
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter((o) => o && o !== '*')

  if (redirectUrl) {
    try {
      const parsed = new URL(redirectUrl)
      const origin = parsed.origin.replace(/\/+$/, '')
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return origin
      }
    } catch {}
  }

  if (requestOrigin) {
    const cleanOrigin = requestOrigin.replace(/\/+$/, '')
    if (allowedOrigins.length === 0 || allowedOrigins.includes(cleanOrigin)) {
      return cleanOrigin
    }
  }

  if (allowedOrigins.length > 0) {
    return allowedOrigins[0]
  }

  return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '')
}

export const syncAuthUser = defineAction(
  {
    method: 'post',
    path: '/auth/sync',
    summary: 'Sincronizar usuário logado via Frontend',
    tags: ['Autenticação'],
    authenticate: false,
    middlewares: [authRateLimiter],
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: 'Sucesso', schema: syncResponseSchema },
      401: { description: 'Token do Firebase não fornecido ou inválido' },
      403: { description: 'Acesso negado' }
    }
  },
  async ({ defaultExpress, data, manageError }: ManageRequestBody<SyncUserRequest>): ManageRequestResponse<SyncUserResponse> => {
    const authHeader = defaultExpress.req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return manageError({ code: 'no_token' })
    }

    const token = authHeader.split('Bearer ')[1]?.trim()

    if (!token) {
      return manageError({ code: 'no_token' })
    }

    let decodedToken

    try {
      decodedToken = await firebaseAuth.verifyIdToken(token)
    } catch (error) {
      return manageError({ code: 'token_is_not_valid', error })
    }

    if (decodedToken.uid !== data.id) {
      return manageError({ code: 'forbidden' })
    }

    try {
      const payload = {
        name: data.name,
        email: data.email,
        photoUrl: data.photoUrl ?? '',
        authProviderId: data.authProviderId ?? 'google'
      }

      const user = await userRepository.upsert(data.id, payload)
      const secret = getJwtSecret()
      const tokenPayload = { email: user.email, authProviderId: user.authProviderId }
      
      const token = jwt.sign(tokenPayload, secret, { subject: user.id, expiresIn: '7d' })

      logRepository.create({
        category: 'user',
        level: 'info',
        action: 'AUTH_LOGIN',
        title: 'Login efetuado',
        description: `${user.fullName || user.name} autenticou no sistema (${user.authProviderId})`,
        userId: user.id,
        userName: user.fullName || user.name,
        userEmail: user.email
      })

      return { user, token }
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: syncUserSchema }
)

export const getMe = defineAction(
  {
    method: 'get',
    path: '/auth/me',
    summary: 'Buscar dados do usuário logado',
    tags: ['Autenticação'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: userSchema }
    }
  },
  async ({ ids, manageError }: ManageRequestBody): ManageRequestResponse<UserResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const user = await userRepository.findById(ids.userId)

      if (!user) return manageError({ code: 'user_not_found' })

      return user
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  }
)

export const updateMe = defineAction(
  {
    method: 'patch',
    path: '/auth/me',
    summary: 'Atualizar dados do usuário logado',
    tags: ['Autenticação'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: userSchema }
    }
  },
  async ({ ids, data, manageError }: ManageRequestBody<UpdateUserRequest>): ManageRequestResponse<UserResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const user = await userRepository.update(ids.userId, data)

      if (!user) return manageError({ code: 'user_not_found' })

      logRepository.create({
        category: 'user',
        level: 'info',
        action: 'PROFILE_UPDATE',
        title: 'Perfil atualizado',
        description: `${user.fullName || user.name} atualizou dados do perfil`,
        userId: user.id,
        userName: user.fullName || user.name,
        userEmail: user.email,
        details: data
      })

      return user
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: updateUserSchema }
)

export const forgotPassword = defineAction(
  {
    method: 'post',
    path: '/auth/forgot-password',
    summary: 'Solicitar link de redefinição de senha por e-mail',
    tags: ['Autenticação'],
    authenticate: false,
    middlewares: [authRateLimiter],
    responses: {
      204: { description: 'Sucesso' }
    }
  },
  async ({ defaultExpress, data, manageError }: ManageRequestBody<ForgotPasswordRequest>): ManageRequestResponse => {
    try {
      const normalizedEmail = data.email.trim().toLowerCase()
      let dbUser = await userRepository.findByEmail(normalizedEmail)
      if (!dbUser && normalizedEmail !== data.email.trim()) {
        dbUser = await userRepository.findByEmail(data.email.trim())
      }

      let firebaseUserRecord = null
      try {
        firebaseUserRecord = await firebaseAuth.getUserByEmail(normalizedEmail)
      } catch {
        firebaseUserRecord = null
      }

      const targetUid = firebaseUserRecord?.uid || dbUser?.id
      const targetEmail = firebaseUserRecord?.email || dbUser?.email

      if (!targetUid || !targetEmail) {
        return
      }

      const displayName = dbUser?.fullName || dbUser?.name || firebaseUserRecord?.displayName || 'Usuário'
      const secret = getJwtSecret()
      const resetToken = jwt.sign(
        {
          purpose: 'password-reset',
          email: targetEmail,
          updatedAt: dbUser?.updatedAt ?? ''
        },
        secret,
        {
          subject: targetUid,
          expiresIn: '1h'
        }
      )

      const baseUrl = resolveFrontendBaseUrl(data.redirectUrl, defaultExpress.req.headers.origin)
      const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`

      const emailResult = await passwordResetTemplate.send({
        to: targetEmail,
        variables: {
          userName: displayName,
          resetLink
        }
      })

      if (!emailResult.success) {
        return manageError({
          code: 'internal_error',
          details: 'Não foi possível enviar o e-mail de redefinição de senha no momento.'
        })
      }

      logRepository.create({
        category: 'user',
        level: 'info',
        action: 'PASSWORD_RESET_REQUEST',
        title: 'Solicitação de redefinição de senha',
        description: `Link de redefinição de senha enviado para ${targetEmail}`,
        userId: targetUid,
        userName: displayName,
        userEmail: targetEmail
      })
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: forgotPasswordSchema }
)

export const resetPassword = defineAction(
  {
    method: 'post',
    path: '/auth/reset-password',
    summary: 'Redefinir senha usando token enviado por e-mail',
    tags: ['Autenticação'],
    authenticate: false,
    middlewares: [authRateLimiter],
    responses: {
      204: { description: 'Sucesso' }
    }
  },
  async ({ data, manageError }: ManageRequestBody<ResetPasswordRequest>): ManageRequestResponse => {
    const secret = getJwtSecret()
    let decoded: PasswordResetTokenPayload

    try {
      decoded = jwt.verify(data.token, secret) as PasswordResetTokenPayload
    } catch {
      return manageError({
        code: 'bad_request',
        details: 'O link de redefinição de senha é inválido ou expirou. Solicite um novo link.'
      })
    }

    if (decoded.purpose !== 'password-reset' || !decoded.sub) {
      return manageError({
        code: 'bad_request',
        details: 'Token de redefinição de senha inválido.'
      })
    }

    try {
      const dbUser = await userRepository.findById(decoded.sub)

      if (dbUser && decoded.updatedAt !== undefined && decoded.updatedAt !== (dbUser.updatedAt ?? '')) {
        return manageError({
          code: 'bad_request',
          details: 'Este link de redefinição de senha já foi utilizado. Solicite um novo link caso precise.'
        })
      }

      await firebaseAuth.updateUser(decoded.sub, {
        password: data.password
      })

      if (dbUser) {
        await userRepository.update(decoded.sub, {})
      }

      logRepository.create({
        category: 'user',
        level: 'info',
        action: 'PASSWORD_RESET_SUCCESS',
        title: 'Senha redefinida com sucesso',
        description: `${dbUser?.fullName || dbUser?.name || decoded.email} redefiniu a senha da conta`,
        userId: decoded.sub,
        userName: dbUser?.fullName || dbUser?.name,
        userEmail: dbUser?.email || decoded.email
      })
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: resetPasswordSchema }
)
