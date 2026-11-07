import type { FormEvent } from 'react'
import type { ProfileFormValues } from '../../types'

export interface ProfileDetailsFormProps {
  email: string
  values: ProfileFormValues
  isDirty: boolean
  isSaving: boolean
  isSendingReset: boolean
  onChangeField: (field: keyof ProfileFormValues, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onReset: () => void
  onSendPasswordReset: () => Promise<void>
}
