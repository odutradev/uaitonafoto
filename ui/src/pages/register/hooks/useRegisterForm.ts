import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import type { FormEvent } from 'react'

export interface UseRegisterFormReturn {
  name: string
  setName: (value: string) => void
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  confirmPassword: string
  setConfirmPassword: (value: string) => void
  errorMessage: string
  submitting: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  handleGoogleLogin: () => Promise<void>
}

const getFirebaseErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está cadastrado. Tente fazer login.'
      case 'auth/weak-password':
        return 'A senha é muito fraca. Utilize pelo menos 6 caracteres.'
      case 'auth/invalid-email':
        return 'E-mail inválido. Por favor, verifique o formato.'
      case 'auth/network-request-failed':
        return 'Falha de rede. Verifique sua conexão e tente novamente.'
      default:
        break
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocorreu um erro ao criar a conta. Tente novamente.'
}

export const useRegisterForm = (): UseRegisterFormReturn => {
  const { registerWithEmail, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.')
      return
    }

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, preencha todos os campos.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Por favor, verifique.')
      return
    }

    setSubmitting(true)
    try {
      await registerWithEmail({ name: name.trim(), email: email.trim(), password })
      navigate('/')
    } catch (err) {
      setErrorMessage(getFirebaseErrorMessage(err))
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
      setErrorMessage(getFirebaseErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errorMessage,
    submitting,
    handleSubmit,
    handleGoogleLogin
  }
}

export default useRegisterForm

