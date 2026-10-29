import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import type { FormEvent } from 'react'

export interface UseLoginFormReturn {
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  submitting: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  handleGoogleLogin: () => Promise<void>
}

export const useLoginForm = (): UseLoginFormReturn => {
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !password) return

    setSubmitting(true)
    try {
      await loginWithEmail({ email, password })
      navigate('/')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSubmitting(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    submitting,
    handleSubmit,
    handleGoogleLogin
  }
}

export default useLoginForm

