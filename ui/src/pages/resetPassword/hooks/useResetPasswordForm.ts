import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmPasswordReset, requestPasswordReset } from '@services/auth/passwordReset'
import useQueryParams from '@hooks/useQueryParams'
import type { FormEvent } from 'react'

export interface UseResetPasswordFormReturn {
  token?: string
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  submitting: boolean
  submitted: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export const useResetPasswordForm = (): UseResetPasswordFormReturn => {
  const { token } = useQueryParams<{ token?: string }>()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      if (token) {
        await confirmPasswordReset({ token, password })
        navigate('/login')
        return
      }

      await requestPasswordReset({ email })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    token,
    email,
    setEmail,
    password,
    setPassword,
    submitting,
    submitted,
    handleSubmit
  }
}

export default useResetPasswordForm
