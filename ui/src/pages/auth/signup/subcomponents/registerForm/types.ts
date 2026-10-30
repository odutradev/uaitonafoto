import type { FormEvent } from 'react'

export interface RegisterFormProps {
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
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onGoogleLogin: () => Promise<void>
}

