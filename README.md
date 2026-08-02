# Tayseer Innovations — Corporate Website

Modern CMS-driven bilingual (EN/AR) corporate site for Tayseer Innovations.

## Solution

| Project | Stack |
|---------|--------|
| `src/Tayseer.Web` | Angular 21 · SSR · Tailwind · Signals |
| `src/Tayseer.Api` | .NET 10 Minimal API · EF Core · SQL Server |

## Phase status

### Phase 0
- [x] Angular SSR scaffold + folder structure
- [x] Brand assets + geometric motif
- [x] Tailwind brand tokens (blue `#095A8D`, green `#62A845`, dark mode)
- [x] API: CORS, health, Swagger, EF + seeded services
- [x] Content model + redirect map docs

### Phase 1
- [x] Top bar, mega-nav, sticky mobile CTA, footer
- [x] Trust strip + home hero
- [x] Service Card (LTR/RTL + light/dark)
- [x] Bento services grid hydrated from `GET /api/v1/services`
- [x] Locale routes `/en` · `/ar`

## Prerequisites

- Node.js 22+
- .NET 10 SDK
- SQL Server LocalDB (or update connection string)

## Run API

```bash
cd src/Tayseer.Api
dotnet run --launch-profile https
```

- Swagger: `https://localhost:7214/swagger`
- Health: `https://localhost:7214/health`
- Services: `https://localhost:7214/api/v1/services?lang=en`

## Run Web

```bash
cd src/Tayseer.Web
npm start
```

Open `http://localhost:4200`. Use header toggles for EN/AR (RTL) and dark/light.

## Brand

Assets live in `assets/brand/` and `src/Tayseer.Web/public/brand/`.

## Docs

- [CMS content model](docs/cms-content-model.md)
- [Redirect map](docs/redirect-map.md)

## Next

**Phase 2** — in progress / done for services: CMS feature seed, solutions hub, product detail pages, HTTP transfer cache.

**Phase 3** — About / Connect / Careers / Blog / Legal content pages.
