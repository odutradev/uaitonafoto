import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmPasswordReset, requestPasswordReset } from '@actions/auth'
import useQueryParams from '@hooks/useQueryParams'
import type { FormEvent } from 'react'
import type { UseResetPasswordPageReturn } from './types'
import createPageContext from '@utils/functions/createPageContext'

const useResetPasswordPageState = (): UseResetPasswordPageReturn => {
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
        navigate('/signin')
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

const { PageProvider: ResetPasswordPageProvider, usePage: useResetPasswordPage } = createPageContext(
  useResetPasswordPageState,
  'useResetPasswordPage'
)

export { ResetPasswordPageProvider }
export default useResetPasswordPage
