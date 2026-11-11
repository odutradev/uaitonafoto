export interface PlanCardData {
  id: string;
  abacateProductId: string;
  badge?: string;
  tag: string;
  title: string;
  price: string;
  period: string;
  subBadge?: string;
  costPerEvent?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlighted: boolean;
}

export interface UpsellBannerData {
  id: string;
  abacateProductId: string;
  badge: string;
  title: string;
  price: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}
