import type { ProfileFormValues } from '@pages/app/profile/types'
import type { AuthUser } from '@stores/auth/types'
import type { FormEvent } from 'react'

export interface UseProfilePageReturn {
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
