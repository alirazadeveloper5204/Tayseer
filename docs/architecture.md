# Architecture (Phase 0)

```
Tayseer/
├── src/Tayseer.Web/     Angular 21 SSR (public + future /admin)
├── src/Tayseer.Api/     .NET 10 Minimal API CMS
├── assets/brand/        Logo, favicon, geometric motif
├── docs/                Content model, redirects
└── _scrape/             Local EN snapshot from tayseer.me (not shipped)
```

## Runtime flow

1. Browser / Angular SSR requests locale-aware JSON from the API.
2. EF Core reads bilingual columns; public endpoints resolve `lang`.
3. Admin (Phase 4) will mutate the same tables behind JWT.

## Defaults

- Auth: JWT in Phase 4 (Entra later)
- DB: SQL Server LocalDB in development
- Locales: `/en` `/ar` routes in Phase 1
- Theme: dark-first class strategy (`html.dark`)
