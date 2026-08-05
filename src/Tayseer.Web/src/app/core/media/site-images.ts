/** Site imagery under /public/images — high-res branded + editorial assets. */
export const SITE_IMAGES = {
  hero: '/images/hero-fintech.jpg',
  about: '/images/about-main.jpg',
  clients: '/images/clients-main.jpg',
  solutionsBanner: '/images/solutions-banner.jpg',
  deployOnPrem: '/images/deploy-onprem.jpg',
  deployCloud: '/images/deploy-cloud.jpg',
  galleryWorkspace: '/images/gallery-workspace.jpg',
  galleryAnalytics: '/images/gallery-analytics.jpg',
  galleryMobile: '/images/gallery-mobile.jpg',
  galleryMeeting: '/images/gallery-meeting.jpg',
  thumbDubai: '/images/thumb-dubai.jpg',
  thumbSkyline: '/images/thumb-skyline.jpg',
} as const;

const SERVICE_IMAGES: Record<string, string> = {
  'core-banking': '/images/service-core-banking.jpg',
  'fahim-ai': '/images/service-fahim-ai.jpg',
  mbuke: '/images/service-mbuke.jpg',
  'software-management-systems': '/images/service-software.jpg',
  'managed-services': '/images/service-managed.jpg',
  'banking-systems': '/images/service-banking-systems.jpg',
};

export const SERVICE_IMAGE_ENTRIES = Object.entries(SERVICE_IMAGES).map(([slug, src]) => ({
  slug,
  src,
}));

export function serviceImage(slug: string): string {
  return SERVICE_IMAGES[slug] ?? SITE_IMAGES.solutionsBanner;
}

/** About section collage: main + supporting thumbs (high-res assets). */
export const ABOUT_COLLAGE = {
  main: '/images/about-main.jpg',
  thumbs: [
    '/images/about-thumb-1.jpg',
    '/images/about-thumb-2.jpg',
    '/images/about-thumb-3.jpg',
  ],
} as const;

/** Client / testimonials collage — one gallery per testimonial slide. */
export type ClientGallery = {
  main: string;
  thumbs: readonly [string, string, string];
};

export const CLIENT_GALLERIES: readonly ClientGallery[] = [
  {
    main: '/images/clients-main.jpg',
    thumbs: [
      '/images/clients-thumb-1.jpg',
      '/images/clients-thumb-2.jpg',
      '/images/clients-thumb-3.jpg',
    ],
  },
  {
    main: '/images/client-1-main.jpg',
    thumbs: [
      '/images/client-1-thumb-1.jpg',
      '/images/client-1-thumb-2.jpg',
      '/images/client-1-thumb-3.jpg',
    ],
  },
  {
    main: '/images/client-2-main.jpg',
    thumbs: [
      '/images/client-2-thumb-1.jpg',
      '/images/client-2-thumb-2.jpg',
      '/images/client-2-thumb-3.jpg',
    ],
  },
  {
    main: '/images/client-3-main.jpg',
    thumbs: [
      '/images/client-3-thumb-1.jpg',
      '/images/client-3-thumb-2.jpg',
      '/images/client-3-thumb-3.jpg',
    ],
  },
] as const;

/** @deprecated Prefer CLIENT_GALLERIES[index] */
export const CLIENTS_COLLAGE = CLIENT_GALLERIES[0];
