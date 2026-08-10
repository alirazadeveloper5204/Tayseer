# Deploy Tayseer on Render (free)

Full stack on Render free tier:

| Piece | Service | Plan |
|-------|---------|------|
| API (`.NET 10`) | Web Service `tayseer-api` | Free |
| Angular SSR | Web Service `tayseer-web` | Free |
| Database | Render Postgres `tayseer-db` | Free (expires after **30 days**) |

Local development stays on **SQL Server LocalDB**. Production uses **PostgreSQL** via env vars.

## Appsettings layout

| File | Role |
|------|------|
| `appsettings.json` | Shared non-secret defaults only (logging, AllowedHosts, JWT issuer/audience) |
| `appsettings.Development.json` | Full local config: LocalDB, localhost CORS, Ollama/RAG, dev JWT + admin seed |
| `appsettings.Production.json` | Full production non-secrets: Postgres provider, Render CORS placeholder, Ollama/RAG off |

**Must come from environment variables in Production** (not committed to the file):

| Env var | Purpose |
|---------|---------|
| `ConnectionStrings__DefaultConnection` | Postgres connection string (Render/Neon) |
| `Jwt__SigningKey` | At least 32 characters (required to start) |
| `AdminSeed__Password` | Initial admin password (skipped if empty) |
| `Cors__AngularOrigins__0` | Public Angular URL (override the Render placeholder) |

Optional: `Database__Provider=Npgsql` (already set in Production + `render.yaml`).

Render’s Internal/External Database URL looks like `postgresql://user:pass@host/db`. The API converts that URI to Npgsql keyword form (`Host=...;SSL Mode=Require;...`) at startup — do not paste a SQL Server-style string.

## Web service env vars (API URL)

The browser uses **same-origin** `/api`, `/hubs`, and `/health`. The Node SSR server reverse-proxies those to your API, so DevTools Network shows `tayseer-web…/api/…` instead of the API hostname. This is obscurity only — payloads are still visible.

| Env var | Required | Used for |
|---------|----------|----------|
| `API_BASE_URL` | Yes | Proxy upstream (+ baked `ssrApiBaseUrl` if `SSR_API_BASE_URL` unset) |
| `SSR_API_BASE_URL` | No | Preferred upstream for SSR fetches & proxy (private network when possible) |
| `API_PROXY_TARGET` | No | Override proxy target only (defaults to `SSR_API_BASE_URL` \|\| `API_BASE_URL`) |
| `SITE_URL` | Yes | Canonical site origin for SEO |

Render public hostnames can include a **random suffix** (e.g. `tayseer-api-mp4f`). Always copy the URL from the Render dashboard — `https://tayseer-api.onrender.com` may 404 even if the service is healthy under the suffixed name.

Private network (same region) example:

```text
SSR_API_BASE_URL=http://tayseer-api:10000
```

- Host = service name (`tayseer-api`)
- Port = the port the API container listens on (Render usually sets `PORT=10000` for Docker web services)
- Browsers hit the web origin only; Node forwards to this upstream
- If unset, both SSR and the proxy fall back to public `API_BASE_URL`

**How Render builds the image**

1. You set `API_BASE_URL` / `SSR_API_BASE_URL` / `SITE_URL` on the `tayseer-web` service.
2. Render forwards those env vars into `docker build` as matching **build ARGs**.
3. `src/Tayseer.Web/Dockerfile` writes `apiBaseUrl: ''` and `ssrApiBaseUrl` into `environment.production.ts`, then runs `npm run build`.
4. At **runtime**, the same env vars configure the Express `/api` proxy in `server.ts`.

After changing `SSR_API_BASE_URL` / `SITE_URL`, trigger a **Manual Deploy** (clear build cache if SSR URL looks stale) so the Angular SSR bundle is rebuilt. Changing only the runtime proxy target via `API_PROXY_TARGET` does not require a rebuild.

Do **not** put secrets in these URL vars.

**SSR private networking (recommended after first deploy)**

When `tayseer-web` and `tayseer-api` are in the same Render region:

```text
SSR_API_BASE_URL=http://tayseer-api:10000
```

Rebuild the web image after setting it.

## Limits to expect

- Free web services **sleep after ~15 minutes** idle → first request can take 30–60s.
- Free Postgres lasts **30 days**, then you must upgrade or move data (Neon free is a good long-term alternative).
- Two free services share monthly free instance hours; fine for demos.
- Ollama / RAG is **off** in Production (`Ollama__RagEnabled=false`). Chat needs a hosted model later if you want Fahim in prod.

## 1. Push the repo to GitHub / GitLab

Render deploys from a Git remote. Commit and push these deploy files first.

## 2. Blueprint deploy (fastest)

1. Open [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
2. Connect this repository and select `render.yaml`.
3. When prompted for secrets / unset vars, set:
   - `AdminSeed__Password` — strong admin password (not the local default).
   - `Cors__AngularOrigins__0` — temporarily `https://tayseer-web.onrender.com` (update after the web URL is known).
   - `SSR_API_BASE_URL` — optional; leave blank on first deploy, or set private URL once API is up.
4. Create the blueprint (`tayseer-api`, `tayseer-web`, `tayseer-db`).

`render.yaml` sets `API_BASE_URL=https://tayseer-api-mp4f.onrender.com`. If Render assigned a different public hostname, update this env var (and redeploy **web**) to match the API service URL from the dashboard.

## 3. Wire CORS + API URL after first deploy

After both services have public URLs:

1. **API → Environment**
   - `Cors__AngularOrigins__0` = `https://<your-web-service>.onrender.com`
2. **Web → Environment**
   - `API_BASE_URL` = `https://<your-api-service>.onrender.com` (exact dashboard URL; may include a suffix like `-mp4f`)
   - Optional: `SSR_API_BASE_URL` = `http://tayseer-api:10000` (same-region private network)
3. **Manual Deploy** both services after env changes (web must rebuild so the Angular bundle picks up the new API URL).

## 4. Verify

- API health: `https://<api>.onrender.com/health`
- API ready: `https://<api>.onrender.com/health/ready`
- Site: `https://<web>.onrender.com/en`
- Admin: `https://<web>.onrender.com/admin/login` with `AdminSeed__Email` / `AdminSeed__Password`
- Browser network tab: API calls go to same-origin `/api/...` (proxied to the API)

## 5. Longer-lived free Postgres (optional)

If you outgrow the 30-day Render DB:

1. Create a free DB at [Neon](https://neon.tech/).
2. On `tayseer-api`, set:

```text
Database__Provider=Npgsql
ConnectionStrings__DefaultConnection=<neon connection string>
```

3. Redeploy the API (schema is created with `EnsureCreated` on startup).

## Manual service setup (without Blueprint)

### Database

**New → PostgreSQL → Free** → name `tayseer-db`. Copy the **Internal Database URL**.

### API

1. **New → Web Service** → connect the repo → **Docker**
2. Dockerfile path: `src/Tayseer.Api/Dockerfile`
3. Docker build context: repo root `.`
4. Instance: **Free**
5. Health check path: `/health`
6. Environment:

```text
ASPNETCORE_ENVIRONMENT=Production
DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false
Database__Provider=Npgsql
ConnectionStrings__DefaultConnection=<Internal Database URL from Render Postgres>
Cors__AngularOrigins__0=https://<web>.onrender.com
Jwt__SigningKey=<at least 32 random chars>
AdminSeed__Email=admin@tayseer.me
AdminSeed__Password=<strong password>
Ollama__RagEnabled=false
```

7. Deploy, note the public URL from the dashboard (e.g. `https://tayseer-api-mp4f.onrender.com`).

### Web

1. **New → Web Service** → connect the repo → **Docker**
2. Dockerfile path: `src/Tayseer.Web/Dockerfile`
3. Docker build context: repo root `.`
4. Instance: **Free**
5. Environment (these become Docker build ARGs automatically — do not look for a separate “Docker build args” Blueprint field):

```text
NODE_ENV=production
API_BASE_URL=https://<api>.onrender.com
SSR_API_BASE_URL=http://tayseer-api:10000
```

Omit `SSR_API_BASE_URL` if you are unsure of the private port; SSR will use the public `API_BASE_URL` instead.

6. Deploy the web service, then update API `Cors__AngularOrigins__0` to the web public URL and redeploy the API.

## Local Docker smoke test

```bash
# API (needs a Postgres connection string)
docker build -f src/Tayseer.Api/Dockerfile -t tayseer-api .
docker run --rm -p 8080:8080 \
  -e Database__Provider=Npgsql \
  -e ConnectionStrings__DefaultConnection="Host=host.docker.internal;Port=5432;Database=tayseer;Username=...;Password=..." \
  -e Jwt__SigningKey="CHANGE_ME_DEV_ONLY_TAYSEER_JWT_SIGNING_KEY_32+" \
  -e Cors__AngularOrigins__0="http://localhost:4200" \
  tayseer-api

# Web — local builds still use --build-arg; on Render use env vars instead
docker build -f src/Tayseer.Web/Dockerfile \
  --build-arg API_BASE_URL=http://localhost:8080 \
  --build-arg SSR_API_BASE_URL=http://localhost:8080 \
  -t tayseer-web .
docker run --rm -p 4000:4000 tayseer-web
```

## Security (Sprint 1)

| Control | Where | Notes |
|---------|--------|------|
| Rate limiting | API | Login **5/min**, contact **10/min**, chat/agent-chat **30/min** per client IP → `429` |
| Admin role | API | CMS / admin agent-chat / `/auth/me` / knowledge reindex require role `Admin` |
| Security headers | API + Web | `HSTS` (non-localhost), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` |
| Client IP | API + Web proxy | `UseForwardedHeaders` + proxy `xfwd` so limits see the real visitor IP behind Render |

## Security (Sprint 2)

| Control | Where | Notes |
|---------|--------|------|
| HttpOnly JWT cookie | API + Web | Login sets `tayseer_auth` (`HttpOnly`, `Secure` on HTTPS/Render, `SameSite=Lax`). Token is **not** in `localStorage` or the login JSON body. CSRF mitigated via `SameSite=Lax` + same-origin `/api` proxy. |
| Session restore | Web | Admin route guards call `GET /api/v1/auth/me` with cookies. |
| Logout | API | `POST /api/v1/auth/logout` clears the cookie. |
| SignalR | Web | Hub connects with `withCredentials` (no `access_token` query string). |

Local/dev: keep using the Angular proxy (`apiBaseUrl: ''`) so the cookie is host-scoped to `localhost:4200`.

## Security (Sprint 3)

| Control | Where | Notes |
|---------|--------|------|
| EF migrations (Postgres) | API | Production uses `Migrate` via `Data/Migrations`. Existing EnsureCreated DBs are **baselined** (history rows only — no DROP). Local SQL Server still uses `EnsureCreated`. |
| SSL in transit | API | `Database:SslMode` (default `Require`) + `Database:TrustServerCertificate` (default `true` for Render compatibility). |
| Least-privilege DB user | Ops | Optional: run `docs/sql/postgres-app-role.sql`, then point `ConnectionStrings__DefaultConnection` at `tayseer_app`. Use the owner account only for schema migrations. |

### Adding a schema change later

```bash
cd src/Tayseer.Api
dotnet ef migrations add YourChangeName --output-dir Data/Migrations
```

Redeploy the API so `Migrate` runs. If the app uses `tayseer_app`, temporarily switch to the owner connection for that deploy (or run migrations from a privileged job).

### Tighten SSL further (optional)

When you can trust the provider CA:

```text
Database__SslMode=VerifyFull
Database__TrustServerCertificate=false
```

If the API fails to connect, keep the Sprint 3 defaults (`Require` + trust certificate).

### Least-privilege checklist

1. Deploy Sprint 3 once with the current (owner) connection so migrations/baseline succeed.
2. Edit and run `docs/sql/postgres-app-role.sql` in the Render/Neon SQL console.
3. Update `ConnectionStrings__DefaultConnection` to use `tayseer_app` + its password.
4. Redeploy and confirm `/health/ready` is healthy.

### SignalR conversation join

`JoinConversation` requires a valid `visitorKey` matching the conversation (admins authenticated with role `Admin` may join without a key). Random GUIDs can no longer subscribe to another visitor’s live messages.

### Dependency audit (monthly)

From `src/Tayseer.Web`:

```bash
npm run audit:deps        # production deps only
npm run audit:deps:all    # including devDependencies
```

Triage high/critical findings; prefer `npm audit fix` when safe. Don’t blind `npm audit fix --force` across Angular majors.

## Third-party / CDN

- **Fonts** are self-hosted via `@fontsource/*` (bundled with the web app). There is no Google Fonts CDN link in `index.html`.
- **API calls** from the browser use same-origin `/api` (and `/hubs`, `/health`); the Node SSR server proxies to `API_BASE_URL` / `SSR_API_BASE_URL`. This hides the API hostname from casual inspection only — request bodies remain visible in DevTools.
- **Google Maps embeds** on the Contact page still load `maps.google.com` iframes. To drop that origin later: replace the iframe with a static map image + “Open in Maps” link, or use a self-hosted tile provider (OpenStreetMap / MapLibre).

## Troubleshooting

### Browser CORS error + API `404` / `x-render-routing: no-server`

The API process is **not running**. CORS is a side effect — Render’s “Not Found” response has no `Access-Control-Allow-Origin` header.

Common cause on free tier: ASP.NET file watchers exceed the **inotify** limit:

```text
System.IO.IOException: The configured user limit (128) on the number of inotify instances has been reached
```

Fix (already in this repo): set `DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false` and redeploy the API. Confirm `/health` returns JSON before testing the site.

### CORS only (API `/health` works)

Set `Cors__AngularOrigins__0` exactly to the web origin (no trailing slash), e.g. `https://tayseer-web.onrender.com`, then redeploy the API.

## Security checklist before sharing the URL

- Change `AdminSeed__Password` and `Jwt__SigningKey`
- Do not commit real production secrets
- Prefer Render secret env vars (`sync: false` in the blueprint)
- Treat `API_BASE_URL` as non-secret config (used by the server proxy; not needed in browser JS)
