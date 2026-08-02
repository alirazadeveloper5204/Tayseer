/** Local professional imagery under /public/images (Unsplash, free license). */
export const SITE_IMAGES = {
  hero: '/images/hero-fintech.jpg',
  about: '/images/about-partnership.jpg',
  clients: '/images/clients-office.jpg',
  solutionsBanner: '/images/solutions-banner.jpg',
  deployOnPrem: '/images/deploy-onprem.jpg',
  deployCloud: '/images/deploy-cloud.jpg',
} as const;

const SERVICE_IMAGES: Record<string, string> = {
  'core-banking': '/images/service-core-banking.jpg',
  'fahim-ai': '/images/service-fahim-ai.jpg',
  mbuke: '/images/service-mbuke.jpg',
  'software-management-systems': '/images/service-software.jpg',
  'managed-services': '/images/service-managed.jpg',
  'banking-systems': '/images/service-banking-systems.jpg',
};

export function serviceImage(slug: string): string {
  return SERVICE_IMAGES[slug] ?? SITE_IMAGES.solutionsBanner;
}
