import type { FormEvent } from 'react'

export interface UseResetPasswordPageReturn {
  token?: string
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  submitting: boolean
  submitted: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}
