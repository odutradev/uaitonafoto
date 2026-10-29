import { Bounce } from 'react-toastify'

import type { ToastContainerProps, ToastPosition } from 'react-toastify'
import type { ToastMessages } from '@hooks/useAction/types'

export const getToastContainerConfig = (theme: 'light' | 'dark'): ToastContainerProps => ({
  position: 'top-center' as ToastPosition,
  hideProgressBar: false,
  pauseOnFocusLoss: true,
  transition: Bounce,
  pauseOnHover: true,
  closeOnClick: false,
  newestOnTop: false,
  autoClose: 5000,
  draggable: true,
  rtl: false,
  theme
})

export const defaultToastMessages: ToastMessages = {
  success: 'Requisição realizada com sucesso',
  pending: 'Inicializando requisição',
  error: 'Erro na requisição'
}