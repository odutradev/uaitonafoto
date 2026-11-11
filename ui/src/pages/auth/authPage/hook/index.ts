import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import type { FormEvent } from 'react'
import type { AuthMode } from '@pages/auth/authPage/types'
import createPageContext from '@utils/functions/createPageContext'
import type { UseAuthPageReturn } from './types'

const getFirebaseErrorMessage = (error: unknown, mode: AuthMode): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-mail ou senha incorretos. Por favor, tente novamente.'
      case 'auth/email-already-in-use':
        return 'Este e-mail já está cadastrado. Tente fazer login.'
      case 'auth/weak-password':
        return 'A senha é muito fraca. Utilize pelo menos 6 caracteres.'
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

  return mode === 'signup'
    ? 'Ocorreu um erro ao criar a conta. Tente novamente.'
    : 'Ocorreu um erro ao entrar. Tente novamente.'
}

const useAuthPageState = (): UseAuthPageReturn => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const resolveModeFromPath = useCallback((): AuthMode => {
    return location.pathname.includes('signup') ? 'signup' : 'signin'
  }, [location.pathname])

  const [mode, setModeState] = useState<AuthMode>(resolveModeFromPath)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const nextMode = resolveModeFromPath()
    setModeState(nextMode)
    setErrorMessage('')
    setPassword('')
    setConfirmPassword('')
  }, [resolveModeFromPath])

  const resolvePostAuthDestination = useCallback((): string => {
    const searchParams = new URLSearchParams(location.search)
    const planId = searchParams.get('planId') || searchParams.get('productId')
    if (planId) {
      return `/app?checkout=${encodeURIComponent(planId)}`
    }
    return '/app'
  }, [location.search])

  const setMode = useCallback((newMode: AuthMode) => {
    setModeState(newMode)
    setErrorMessage('')
    setPassword('')
    setConfirmPassword('')
    const targetPath = newMode === 'signup' ? '/signup' : '/signin'
    if (location.pathname !== targetPath) {
      navigate(`${targetPath}${location.search}`)
    }
  }, [location.pathname, location.search, navigate])

  const toggleMode = useCallback(() => {
    const next = mode === 'signin' ? 'signup' : 'signin'
    setMode(next)
  }, [mode, setMode])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (mode === 'signup') {
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
        navigate(resolvePostAuthDestination())
      } catch (err) {
        setErrorMessage(getFirebaseErrorMessage(err, 'signup'))
      } finally {
        setSubmitting(false)
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMessage('Por favor, preencha o e-mail e a senha.')
        return
      }

      setSubmitting(true)
      try {
        await loginWithEmail({ email: email.trim(), password })
        navigate(resolvePostAuthDestination())
      } catch (err) {
        setErrorMessage(getFirebaseErrorMessage(err, 'signin'))
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    setSubmitting(true)
    try {
      await loginWithGoogle()
      navigate(resolvePostAuthDestination())
    } catch (err) {
      setErrorMessage(getFirebaseErrorMessage(err, mode))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    mode,
    isSignUp: mode === 'signup',
    setMode,
    toggleMode,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errorMessage,
    setErrorMessage,
    submitting,
    handleSubmit,
    handleGoogleLogin
  }
}

const { PageProvider: AuthPageProvider, usePage: useAuthPage } = createPageContext(
  useAuthPageState,
  'useAuthPage'
)

export { AuthPageProvider }
export default useAuthPage
