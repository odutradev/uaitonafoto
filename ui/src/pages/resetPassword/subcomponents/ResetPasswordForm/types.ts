import type { FormEvent } from 'react'

export interface ResetPasswordFormProps {
  token?: string
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  submitting: boolean
  submitted: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}
