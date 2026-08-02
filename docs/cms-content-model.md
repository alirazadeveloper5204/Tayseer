# CMS Content Model (Phase 0)

Bilingual fields use `*En` / `*Ar` columns. Public APIs resolve a single locale; admin APIs return both.

## Entities

### ServiceOffering
| Field | Notes |
|--------|--------|
| Slug | Unique, e.g. `fahim-ai` |
| TitleEn / TitleAr | Display name |
| ShortDescriptionEn / ShortDescriptionAr | Card blurb |
| BodyEn / BodyAr | Long copy |
| CtaLabelEn / CtaLabelAr / CtaUrl | CTA |
| IconKey, AccentColor, SortOrder, IsPublished | Presentation |

### ServiceFeature
Child feature blocks for product pages (Payments, KYC, etc.).

### Page + PageSection
Marketing pages composed of ordered sections (`hero`, `trust`, `mantra`, …). `PayloadJson` holds structured block data when needed.

### SiteSetting
Key/value site chrome (email, LinkedIn, ISO badge text).

### Office
Saudi Arabia + UAE locations (seeded).

### Planned (Phase 2+)
Testimonial, Stat, Partner, BlogPost, MediaAsset, Lead, CareerApplication.

## Seeded services (from tayseer.me scrape)
1. core-banking  
2. fahim-ai  
3. mbuke  
4. software-management-systems  
5. managed-services  
6. banking-systems  

## Public API (Phase 2)
- `GET /api/v1/services?lang=en|ar`
- `GET /api/v1/services/{slug}?lang=en|ar` (includes `features`)
- `GET /api/v1/offices?lang=en|ar`
- `GET /health`
- `GET /health/ready`
