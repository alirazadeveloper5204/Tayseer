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

## Web service env vars (API URL)

The Angular production build **bakes** API URLs into the client/SSR bundles. On Render, configure them as **service environment variables** — not Blueprint `dockerBuildArgs` (that field is invalid and will fail validation).

| Env var | Required | Used for |
|---------|----------|----------|
| `API_BASE_URL` | Yes | Browser → public API (`https://tayseer-api.onrender.com`) |
| `SSR_API_BASE_URL` | No | Node SSR → API. Prefer private network when both services are in the same region |

**How Render builds the image**

1. You set `API_BASE_URL` / `SSR_API_BASE_URL` on the `tayseer-web` service.
2. Render forwards those env vars into `docker build` as matching **build ARGs**.
3. `src/Tayseer.Web/Dockerfile` writes them into `environment.production.ts`, then runs `npm run build`.

After changing either URL, trigger a **Manual Deploy** (Clear build cache if the URL looks stale) so the Angular bundle is rebuilt.

**SSR private networking (recommended after first deploy)**

When `tayseer-web` and `tayseer-api` are in the same Render region:

```text
SSR_API_BASE_URL=http://tayseer-api:10000
```

- Host = service name (`tayseer-api`)
- Port = the port the API container listens on (Render usually sets `PORT=10000` for Docker web services)
- Browsers still use the public `API_BASE_URL` (HTTPS)
- If unset, the Dockerfile falls back to `API_BASE_URL` for SSR

Do **not** put secrets in these URL vars — they end up in the client bundle for `API_BASE_URL`.

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

`render.yaml` already sets `API_BASE_URL=https://tayseer-api.onrender.com`. Change it in the Blueprint or Dashboard if your API hostname differs.

## 3. Wire CORS + API URL after first deploy

After both services have public URLs:

1. **API → Environment**
   - `Cors__AngularOrigins__0` = `https://<your-web-service>.onrender.com`
2. **Web → Environment**
   - `API_BASE_URL` = `https://<your-api-service>.onrender.com`
   - Optional: `SSR_API_BASE_URL` = `http://tayseer-api:10000` (same-region private network)
3. **Manual Deploy** both services after env changes (web must rebuild so the Angular bundle picks up the new API URL).

## 4. Verify

- API health: `https://<api>.onrender.com/health`
- API ready: `https://<api>.onrender.com/health/ready`
- Site: `https://<web>.onrender.com/en`
- Admin: `https://<web>.onrender.com/admin/login` with `AdminSeed__Email` / `AdminSeed__Password`
- Browser network tab: API calls go to `API_BASE_URL` (not localhost)

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
Database__Provider=Npgsql
ConnectionStrings__DefaultConnection=<Internal Database URL from Render Postgres>
Cors__AngularOrigins__0=https://<web>.onrender.com
Jwt__SigningKey=<at least 32 random chars>
AdminSeed__Email=admin@tayseer.me
AdminSeed__Password=<strong password>
Ollama__RagEnabled=false
```

7. Deploy, note the public URL (e.g. `https://tayseer-api.onrender.com`).

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

## Security checklist before sharing the URL

- Change `AdminSeed__Password` and `Jwt__SigningKey`
- Do not commit real production secrets
- Prefer Render secret env vars (`sync: false` in the blueprint)
- Treat `API_BASE_URL` as public configuration (it ships in the browser bundle)
