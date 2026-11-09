export type ScreenLayoutMode = 'classic' | 'side-hub' | 'social-feed'

export interface ScreenLayoutOption {
  id: ScreenLayoutMode
  label: string
  subtitle: string
  tag?: string
}

export const SCREEN_LAYOUT_OPTIONS: ScreenLayoutOption[] = [
  {
    id: 'side-hub',
    label: 'Painel Lateral (Recomendado)',
    subtitle: 'Foto com altura total na esquerda e hub interativo com QR Code e recentes na direita.',
    tag: 'Ideal para verticais'
  },
  {
    id: 'social-feed',
    label: 'Feed Social (3 Colunas)',
    subtitle: 'QR Code e dados na esquerda, foto em destaque no centro e feed das últimas fotos na direita.',
    tag: 'Estilo Stories'
  },
  {
    id: 'classic',
    label: 'Clássico',
    subtitle: 'Foto central ampla com miniaturas no rodapé e coluna de QR Code na direita.',
    tag: 'Tradicional'
  }
]
