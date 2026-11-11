import type { EventItem } from "@utils/types/events";

export type TableDisplayTemplateId = "wedding" | "modern" | "corporate" | "minimal" | "party" | "rustic";

export type PrintPageLayout = "a6" | "a4_double" | "a4_quad";

export type TableDisplayQrSize = "standard" | "large";

export interface TableDisplayConfig {
  template: TableDisplayTemplateId;
  title: string;
  subtitle: string;
  customColor?: string;
  customFooter?: string;
  topBadgeText?: string;
  showTopBadge: boolean;
  showPin: boolean;
  showSteps: boolean;
  showBranding: boolean;
  showFrame: boolean;
  qrSize: TableDisplayQrSize;
  pageLayout: PrintPageLayout;
}

export interface TableDisplayCardProps {
  event: EventItem;
  guestUrl: string;
  config: TableDisplayConfig;
  scale?: number;
}
