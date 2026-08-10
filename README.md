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

## Local AI chatbot (Ollama — free)

The site includes a floating chat widget that calls `POST /api/v1/chat` on the API. The API proxies to a local [Ollama](https://ollama.com) model (fully free, runs on your PC).

### 1. Install Ollama

Download from https://ollama.com/download (Windows installer) or:

```powershell
winget install Ollama.Ollama
```

### 2. Pull models

```powershell
ollama pull llama3.2
ollama pull nomic-embed-text
```

`nomic-embed-text` powers **RAG** (retrieval): CMS services/features/offices are embedded at API startup and injected into Fahim’s prompt so answers stay on Tayseer content.

For stronger Arabic replies, try `ollama pull qwen2.5:3b` and set `"Model": "qwen2.5:3b"` under `Ollama` in `src/Tayseer.Api/appsettings.json`.

### 3. Start everything

1. Ensure Ollama is running (the Windows app usually starts the server on `http://localhost:11434`).
2. Start the API (`dotnet run` in `src/Tayseer.Api`) — watch logs for `RAG index ready`.
3. Start the web app (`npm start` in `src/Tayseer.Web`).
4. Open the site and use the **Fahim AI** chat.

Useful endpoints:

- `GET /api/v1/chat/knowledge` — index status (chunk count)
- `POST /api/v1/chat/knowledge/reindex` — rebuild after CMS content changes

> Ollama is ideal for local/dev. Public production needs a hosted model (e.g. Gemini free tier) instead of `localhost:11434`.

## Control panel (Phase 4 MVP)

Authenticated CMS admin lives at `/admin` in the Angular app.

### Default admin (development)

Configured in `src/Tayseer.Api/appsettings.json`:

- Email: `admin@tayseer.me`
- Password: `ChangeMe!Tayseer1`

Change `Jwt:SigningKey` and `AdminSeed:Password` before any shared/deployed environment. Prefer User Secrets for production.

### Features

- JWT login (`POST /api/v1/auth/login`)
- Manage **Services** (CRUD + features) and **Offices**
- Rebuild Fahim RAG knowledge index (`POST /api/v1/chat/knowledge/reindex`, admin-only)
- **Agent inbox** (`/admin/inbox`) — visitors use **Talk to an agent** in the site chat; admins get live SignalR notifications and can claim/reply/close

Open `http://localhost:4200/admin/login` after API + web are running.

### Agent chat (Phase 1)

1. Visitor clicks **Talk to an agent** in the Fahim widget.
2. API stores the conversation and notifies all logged-in admins over SignalR (`/hubs/agent-chat`).
3. Admins open **Agent inbox**, claim the chat, and reply in real time.

Teams channel webhooks are planned as a follow-on (not wired yet).

## Brand

Assets live in `assets/brand/` and `src/Tayseer.Web/public/brand/`.

## Docs

- [CMS content model](docs/cms-content-model.md)
- [Redirect map](docs/redirect-map.md)
- [Deploy on Render (free)](docs/deploy-render.md)

## Next

**Phase 2** — in progress / done for services: CMS feature seed, solutions hub, product detail pages, HTTP transfer cache.

**Phase 3** — About / Connect / Careers / Blog / Legal content pages.
