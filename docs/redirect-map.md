# Redirect Map (Phase 0 draft)

Old [tayseer.me](https://tayseer.me/) URLs to apply at cutover (Azure Front Door / App Service / nginx).

## Pretty paths (legacy WordPress — currently 404)
| From | To |
|------|-----|
| `/about-us/` | `/en/about` |
| `/solutions/` | `/en/solutions` |
| `/core-banking/` | `/en/solutions/core-banking` |
| `/fahim-ai/` | `/en/solutions/fahim-ai` |
| `/mbuke/` | `/en/solutions/mbuke` |
| `/managed-services/` | `/en/managed-services` |
| `/software-management-systems/` | `/en/software-development` |
| `/banking-systems/` | `/en/solutions/banking-systems` |
| `/connect/` | `/en/contact` |
| `/careers/` | `/en/careers` |
| `/blogs-and-resources/` | `/en/faqs` |
| `/privacy-policy/` | `/en/legal/privacy` |
| `/privacy-policy-2/` | `/en/legal/privacy` |
| `/terms-conditions/` | `/en/legal/terms` |

## Static HTML aliases (current live site)
| From | To |
|------|-----|
| `/index.html` | `/en` |
| `/about-us.html` | `/en/about` |
| `/solutions.html` | `/en/solutions` |
| `/core-banking.html` | `/en/solutions/core-banking` |
| `/fahim-ai.html` | `/en/solutions/fahim-ai` |
| `/mbuke.html` | `/en/solutions/mbuke` |
| `/managed-services.html` | `/en/managed-services` |
| `/software-management-systems.html` | `/en/software-development` |
| `/banking-systems.html` | `/en/solutions/banking-systems` |
| `/connect.html` | `/en/contact` |
| `/careers.html` | `/en/careers` |
| `/blogs-and-resources.html` | `/en/faqs` |
| `/privacy-policy.html` | `/en/legal/privacy` |
| `/terms-conditions.html` | `/en/legal/terms` |

These 301s are also applied by the Node SSR server (`src/Tayseer.Web/src/seo/legacy-redirects.ts`) so they work without Front Door on Render/Azure.

In-app aliases: `/en/connect` and `/ar/connect` → `/contact`; `/en/blog` and `/ar/blog` → `/faqs`.

## Arabic
Mirror with `/ar/...` when `Accept-Language` or user preference is Arabic (optional geo rule later).

## Spam / compromised URLs
Any indexed casino/spam blog posts under the old CMS: **410 Gone** + Search Console removal. Do not 301 them into the new blog.
