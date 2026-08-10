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
3. When prompted for secrets, set:
   - `AdminSeed__Password` — strong admin password (not the local default).
   - `Cors__AngularOrigins__0` — temporarily `https://tayseer-web.onrender.com` (update after the web URL is known).
4. Create the blueprint (`tayseer-api`, `tayseer-web`, `tayseer-db`).

## 3. Wire CORS + API URL

After both services have public URLs:

1. **API → Environment**
   - `Cors__AngularOrigins__0` = `https://<your-web-service>.onrender.com`
2. **Web → Environment**
   - Confirm `API_BASE_URL` = `https://<your-api-service>.onrender.com`
   - (Render passes service env vars into Docker as build args automatically.)
3. **Manual Deploy** on each service after env changes.

Optional SSR speed-up (same Render region): set env var

```text
SSR_API_BASE_URL=http://tayseer-api:10000
```
Browsers still use the public `API_BASE_URL`.

## 4. Verify

- API health: `https://<api>.onrender.com/health`
- API ready: `https://<api>.onrender.com/health/ready`
- Site: `https://<web>.onrender.com/en`
- Admin: `https://<web>.onrender.com/admin/login` with `AdminSeed__Email` / `AdminSeed__Password`

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

**New → PostgreSQL → Free** → name `tayseer-db`.

### API

- **New → Web Service** → Docker
- Dockerfile path: `src/Tayseer.Api/Dockerfile`
- Docker build context: repo root `.`
- Instance: **Free**
- Health check path: `/health`
- Env:

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

### Web

- **New → Web Service** → Docker
- Dockerfile path: `src/Tayseer.Web/Dockerfile`
- Docker build context: repo root `.`
- Instance: **Free**
- Environment: `API_BASE_URL=https://<api>.onrender.com` (passed into the Docker build as an ARG)

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

# Web
docker build -f src/Tayseer.Web/Dockerfile \
  --build-arg API_BASE_URL=http://localhost:8080 \
  -t tayseer-web .
docker run --rm -p 4000:4000 tayseer-web
```

## Security checklist before sharing the URL

- Change `AdminSeed__Password` and `Jwt__SigningKey`
- Do not commit real production secrets
- Prefer Render secret env vars (`sync: false` in the blueprint)
