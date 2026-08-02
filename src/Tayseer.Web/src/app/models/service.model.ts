export interface ServiceFeatureDto {
  title: string;
  description: string;
  sortOrder: number;
}

export interface ServiceListItemDto {
  slug: string;
  title: string;
  shortDescription: string;
  iconKey?: string | null;
  accent: string;
  ctaUrl?: string | null;
}

export interface ServiceDto {
  slug: string;
  title: string;
  shortDescription: string;
  body?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  iconKey?: string | null;
  accent: string;
  features: ServiceFeatureDto[];
}

export interface OfficeDto {
  countryCode: string;
  title: string;
  address: string;
  phone?: string | null;
  email?: string | null;
}
