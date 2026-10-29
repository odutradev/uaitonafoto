import type { FormEvent } from 'react'

export interface LoginFormProps {
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  submitting: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onGoogleLogin: () => Promise<void>
}
