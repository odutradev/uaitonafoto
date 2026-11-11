import type { AspectRatioOption, LogoBackgroundOption, LogoColorScheme, LogoType } from '@utils/functions/brandAssets'
import type { BrandAnimation } from '@components/logo/types'
import type { Dispatch, SetStateAction } from 'react'

export interface BrandPaletteColor {
  name: string
  role: string
  hex: string
  rgb: string
  token: string
  textColor: string
  description: string
}

export interface BrandAnimationItem {
  name: string
  key: BrandAnimation
  desc: string
}

export interface UseBrandIdentityPageReturn {
  lastUpdated: string
  selectedType: LogoType
  setSelectedType: Dispatch<SetStateAction<LogoType>>
  selectedScheme: LogoColorScheme
  setSelectedScheme: Dispatch<SetStateAction<LogoColorScheme>>
  selectedBg: LogoBackgroundOption
  setSelectedBg: Dispatch<SetStateAction<LogoBackgroundOption>>
  selectedRatio: AspectRatioOption
  setSelectedRatio: Dispatch<SetStateAction<AspectRatioOption>>
  selectedResolution: number
  setSelectedResolution: Dispatch<SetStateAction<number>>
  copiedColor: string | null
  copiedSvg: boolean
  sampleText: string
  setSampleText: Dispatch<SetStateAction<string>>
  showGrid: boolean
  setShowGrid: Dispatch<SetStateAction<boolean>>
  activeAnimKey: number
  setActiveAnimKey: Dispatch<SetStateAction<number>>
  brandPalette: BrandPaletteColor[]
  handleCopyColor: (hex: string, label: string) => void
  handleDownloadSvg: () => void
  handleDownloadPng: () => Promise<void>
  handleCopySvgCode: () => Promise<void>
  currentSvgRaw: string
  scrollToSection: (id: string) => void
  animationsList: BrandAnimationItem[]
}
