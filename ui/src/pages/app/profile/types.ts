import type { FormEvent } from 'react'
import type { AuthUser } from '@stores/auth/types'

export interface ProfileFormValues {
  name: string
  fullName: string
  phone: string
  photoUrl: string
}

export interface UseProfileReturn {
  user: AuthUser | null
  values: ProfileFormValues
  isDirty: boolean
  isSaving: boolean
  isSendingReset: boolean
  setField: (field: keyof ProfileFormValues, value: string) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  handleResetChanges: () => void
  handleSendPasswordReset: () => Promise<void>
}
