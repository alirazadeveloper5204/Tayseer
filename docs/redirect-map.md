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
| `/managed-services/` | `/en/solutions/managed-services` |
| `/software-management-systems/` | `/en/solutions/software-management-systems` |
| `/banking-systems/` | `/en/solutions/banking-systems` |
| `/connect/` | `/en/connect` |
| `/careers/` | `/en/careers` |
| `/blogs-and-resources/` | `/en/blog` |
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
| `/managed-services.html` | `/en/solutions/managed-services` |
| `/software-management-systems.html` | `/en/solutions/software-management-systems` |
| `/banking-systems.html` | `/en/solutions/banking-systems` |
| `/connect.html` | `/en/connect` |
| `/careers.html` | `/en/careers` |
| `/blogs-and-resources.html` | `/en/blog` |
| `/privacy-policy.html` | `/en/legal/privacy` |
| `/terms-conditions.html` | `/en/legal/terms` |

## Arabic
Mirror with `/ar/...` when `Accept-Language` or user preference is Arabic (optional geo rule later).

## Spam / compromised URLs
Any indexed casino/spam blog posts under the old CMS: **410 Gone** + Search Console removal. Do not 301 them into the new blog.
