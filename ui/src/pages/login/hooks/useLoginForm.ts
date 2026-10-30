import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import type { FormEvent } from 'react'

export interface UseLoginFormReturn {
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  errorMessage: string
  submitting: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  handleGoogleLogin: () => Promise<void>
}

const getFirebaseLoginErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-mail ou senha incorretos. Por favor, tente novamente.'
      case 'auth/invalid-email':
        return 'E-mail inválido. Por favor, verifique o formato.'
      case 'auth/too-many-requests':
        return 'Muitas tentativas sem sucesso. Aguarde alguns instantes e tente novamente.'
      case 'auth/network-request-failed':
        return 'Falha de rede. Verifique sua conexão com a internet.'
      default:
        break
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocorreu um erro ao entrar. Tente novamente.'
}

export const useLoginForm = (): UseLoginFormReturn => {
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.')
      return
    }

    setSubmitting(true)
    try {
      await loginWithEmail({ email: email.trim(), password })
      navigate('/')
    } catch (err) {
      setErrorMessage(getFirebaseLoginErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    setSubmitting(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setErrorMessage(getFirebaseLoginErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    submitting,
    handleSubmit,
    handleGoogleLogin
  }
}

export default useLoginForm
