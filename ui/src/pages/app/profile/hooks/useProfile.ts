import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { getMeData, requestPasswordReset, updateMeData } from '@actions/auth'
import useAuthStore from '@stores/auth'

import type { FormEvent } from 'react'
import type { AuthUser } from '@stores/auth/types'
import type { ProfileFormValues, UseProfileReturn } from '../types'

const toFormValues = (user: AuthUser | null): ProfileFormValues => ({
  name: user?.name ?? '',
  fullName: user?.fullName ?? '',
  phone: user?.phone ?? ''
})

export const useProfile = (): UseProfileReturn => {
  const user = useAuthStore((state) => state.auth.user)
  const updateUser = useAuthStore((state) => state.updateUser)

  const [values, setValues] = useState<ProfileFormValues>(() => toFormValues(user))
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)

  useEffect(() => {
    let isMounted = true

    getMeData()
      .then((freshUser) => {
        if (!isMounted) return
        updateUser(freshUser)
        setValues(toFormValues(freshUser))
      })
      .catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [updateUser])

  const setField = useCallback((field: keyof ProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const isDirty = useMemo(() => {
    if (!user) return false
    const baseline = toFormValues(user)
    return (
      values.name.trim() !== baseline.name.trim() ||
      values.fullName.trim() !== baseline.fullName.trim() ||
      values.phone.trim() !== baseline.phone.trim()
    )
  }, [user, values])

  const handleResetChanges = useCallback(() => {
    setValues(toFormValues(user))
  }, [user])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const trimmedName = values.name.trim()
      if (!trimmedName) {
        toast.error('O nome de exibição não pode ficar vazio.')
        return
      }

      const digitsOnlyPhone = values.phone.replace(/\D/g, '')
      if (values.phone.trim() && digitsOnlyPhone.length < 10) {
        toast.error('Informe um telefone válido com DDD (mínimo de 10 dígitos).')
        return
      }

      setIsSaving(true)
      try {
        const updated = await updateMeData({
          name: trimmedName,
          fullName: values.fullName.trim() || undefined,
          phone: digitsOnlyPhone || undefined
        })
        updateUser(updated)
        setValues(toFormValues(updated))
        toast.success('Perfil atualizado com sucesso!')
      } catch {
        toast.error('Não foi possível salvar as alterações do perfil.')
      } finally {
        setIsSaving(false)
      }
    },
    [updateUser, values]
  )

  const handleSendPasswordReset = useCallback(async () => {
    if (!user?.email) return

    setIsSendingReset(true)
    try {
      await requestPasswordReset({ email: user.email })
      toast.success(`Enviamos um link de redefinição de senha para ${user.email}.`)
    } catch {
      toast.error('Não foi possível enviar o e-mail de redefinição agora.')
    } finally {
      setIsSendingReset(false)
    }
  }, [user?.email])

  return {
    user,
    values,
    isDirty,
    isSaving,
    isSendingReset,
    setField,
    handleSubmit,
    handleResetChanges,
    handleSendPasswordReset
  }
}

export default useProfile
