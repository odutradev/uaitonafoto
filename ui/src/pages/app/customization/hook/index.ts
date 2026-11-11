import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getMeData, updateMeData } from '@actions/auth'
import useAction from '@hooks/useAction'
import useAuthStore from '@stores/auth'
import useAuth from '@hooks/useAuth'
import createPageContext from '@utils/functions/createPageContext'

import type { CustomizationFormState, CustomizationPreviewTab } from '@pages/app/customization/types'
import type { FormEvent } from 'react'
import type { UseCustomizationPageReturn } from './types'

const useCustomizationPageState = (): UseCustomizationPageReturn => {
  const navigate = useNavigate()
  const runAction = useAction()
  const { user } = useAuth()
  const setAuthUser = useAuthStore((state) => state.updateUser)

  const hasPlan = Boolean(user?.hasActiveSubscription)

  const [form, setForm] = useState<CustomizationFormState>(() => ({
    enabled: user?.customization?.enabled ?? true,
    agencyName: user?.customization?.agencyName ?? '',
    agencyLogoUrl: user?.customization?.agencyLogoUrl ?? '',
    agencyWhatsapp: user?.customization?.agencyWhatsapp ?? '',
    agencyTagline: user?.customization?.agencyTagline ?? 'Assessoria & Cerimonial',
    whatsappMessage:
      user?.customization?.whatsappMessage ??
      'Olá! Vi a marca de vocês no evento e gostaria de mais informações para um orçamento.',
    primaryColor: user?.customization?.primaryColor ?? '#FFD21F'
  }))

  const [previewTab, setPreviewTab] = useState<CustomizationPreviewTab>('screen')
  const [isSaving, setIsSaving] = useState(false)

  const setField = <K extends keyof CustomizationFormState>(key: K, value: CustomizationFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!hasPlan) {
      toast.error('É necessário um plano de agência ativo para salvar a personalização.')
      return
    }

    setIsSaving(true)
    await runAction({
      action: async () => {
        await updateMeData({ customization: form })
        return getMeData()
      },
      toastMessages: { success: 'Configurações de personalização salvas!', error: 'Não foi possível salvar as configurações.' },
      shouldUseApiError: false,
      callback: setAuthUser
    })
    setIsSaving(false)
  }

  const cleanPhone = form.agencyWhatsapp?.replace(/\D/g, '') || ''
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(form.whatsappMessage || '')}`

  return {
    navigate,
    hasPlan,
    form,
    setField,
    previewTab,
    setPreviewTab,
    isSaving,
    handleSubmit,
    cleanPhone,
    whatsappUrl
  }
}

const { PageProvider: CustomizationPageProvider, usePage: useCustomizationPage } = createPageContext(useCustomizationPageState, 'useCustomizationPage')

export { CustomizationPageProvider }
export default useCustomizationPage
