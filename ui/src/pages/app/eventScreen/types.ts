export type ScreenLayoutMode = 'lateral' | 'stage' | 'mosaic' | 'duo'
export type ScreenPhotoFit = 'cover' | 'contain'

export interface ScreenLayoutOption {
  id: ScreenLayoutMode
  label: string
  subtitle: string
  tag?: string
}

export interface ScreenPhotoFitOption {
  id: ScreenPhotoFit
  label: string
  subtitle: string
}

export const SCREEN_LAYOUT_OPTIONS: ScreenLayoutOption[] = [
  {
    id: 'lateral',
    label: 'Lateral',
    subtitle: 'Foto à esquerda; texto grande, 4 recentes e QR à direita.',
    tag: 'Melhor para ler de longe'
  },
  {
    id: 'stage',
    label: 'Palco Central',
    subtitle: 'Foto no centro com legenda sobreposta e fundo desfocado ambiente; QR à esquerda e recentes à direita.',
    tag: 'Mais cara de telão'
  },
  {
    id: 'mosaic',
    label: 'Mosaico',
    subtitle: 'Foto com legenda sobre ela e um mural com 5 fotos recentes e QR Code integrado.',
    tag: 'Mais fotos de uma vez'
  },
  {
    id: 'duo',
    label: 'Dupla',
    subtitle: 'Foto atual ao lado da anterior na mesma altura; QR Code e 3 miniaturas na coluna final.',
    tag: 'Foto atual + anterior'
  }
]

export const SCREEN_PHOTO_FIT_OPTIONS: ScreenPhotoFitOption[] = [
  {
    id: 'contain',
    label: 'Desfocar laterais (Foto inteira)',
    subtitle: 'A foto fica 100% visível sem cortes com efeito desfocado ambiente nas laterais.'
  },
  {
    id: 'cover',
    label: 'Cortar e preencher (Sem bordas)',
    subtitle: 'A foto preenche todo o espaço vertical sem bordas desfocadas.'
  }
]
