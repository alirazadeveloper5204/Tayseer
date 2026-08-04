export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
}

export interface AdminServiceListItem {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  shortDescriptionEn: string;
  shortDescriptionAr: string;
  iconKey?: string | null;
  accentColor: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface AdminServiceFeature {
  id?: string | null;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  sortOrder: number;
}

export interface AdminServiceDetail extends AdminServiceListItem {
  bodyEn?: string | null;
  bodyAr?: string | null;
  ctaLabelEn?: string | null;
  ctaLabelAr?: string | null;
  ctaUrl?: string | null;
  features: AdminServiceFeature[];
}

export type UpsertAdminService = Omit<AdminServiceDetail, 'id'> & { id?: string };

export interface AdminOffice {
  id: string;
  countryCode: string;
  titleEn: string;
  titleAr: string;
  addressEn: string;
  addressAr: string;
  phone?: string | null;
  email?: string | null;
  sortOrder: number;
}

export type UpsertAdminOffice = Omit<AdminOffice, 'id'> & { id?: string };

export interface KnowledgeStatus {
  enabled: boolean;
  chunkCount: number;
  builtAtUtc?: string | null;
  lastError?: string | null;
  embeddingModel: string;
}
