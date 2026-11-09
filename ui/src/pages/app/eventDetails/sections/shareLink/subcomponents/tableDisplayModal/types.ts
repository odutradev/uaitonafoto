import type { EventItem } from '@actions/events/types'

export type TableDisplayTemplateId = 'wedding' | 'modern' | 'corporate'

export type PrintPageLayout = 'a6' | 'a4_double' | 'a4_quad'

export interface TableDisplayConfig {
  template: TableDisplayTemplateId
  title: string
  subtitle: string
  showPin: boolean
  showSteps: boolean
  showBranding: boolean
  pageLayout: PrintPageLayout
}

export interface TableDisplayCardProps {
  event: EventItem
  guestUrl: string
  config: TableDisplayConfig
  scale?: number
}
