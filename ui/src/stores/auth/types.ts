export interface UserCustomization {
  enabled: boolean;
  agencyName?: string;
  agencyLogoUrl?: string;
  agencyWhatsapp?: string;
  agencyTagline?: string;
  whatsappMessage?: string;
  primaryColor?: string;
}

export interface AuthUser {
  authProviderId: string;
  fullName?: string;
  photoUrl?: string;
  phone?: string;
  email: string;
  name: string;
  role: string;
  id: string;
  freeCredits: number;
  paidCredits: number;
  freeTrialClaimedAt?: string;
  hasActiveSubscription?: boolean;
  customization?: UserCustomization;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthStoreData {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

export interface AuthStore {
  updateUser: (partialUser: Partial<AuthUser>) => void;
  setToken: (token: string | null) => void;
  setAuthUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  auth: AuthStoreData;
}
