# AGENTS.md

## Cursor Cloud specific instructions

The Cloud Agent environment is repository-managed via `.cursor/environment.json` (`install.sh` installs the .NET 10 SDK, SQL Server 2022, and dependencies; `start.sh` launches SQL Server; the `API` and `Web` terminals run the two services). Standard run commands live in `README.md` ("Run API" / "Run Web"); the notes below are the non-obvious things.

### Services
- `src/Tayseer.Api` — .NET 10 minimal API on `http://localhost:5095` (Swagger at `/swagger`), EF Core + SQL Server. `dotnet run` uses the `http` launch profile, which sets `ASPNETCORE_ENVIRONMENT=Development` (required for Swagger).
- `src/Tayseer.Web` — Angular 21 SSR dev server on `http://localhost:4200`; `proxy.conf.json` forwards `/api`, `/hubs`, and `/health` to the API on `:5095`. Start the API before/with the web app or SSR data fetches fail.

### Database (SQL Server)
- The app hardcodes the SQL Server EF Core provider; the connection string is overridden for Linux and written to `$HOME/.tayseer-db.env` by `install.sh`. The `API` terminal sources that file — run API commands by hand the same way: `source "$HOME/.tayseer-db.env" && dotnet run` from `src/Tayseer.Api`.
- The dev SA password is generated at install time and stored only on the VM at `/var/opt/mssql/.sa_password` (not committed).
- SQL Server's data directory (`/var/opt/mssql/data`) can land on an `overlayfs` layer after a build/snapshot restore, which breaks its read-only `O_DIRECT` opens (`Error 87` / `17113`). `start.sh` forces an overlay copy-up before launching to fix this; if you ever start SQL Server by other means and hit that error, run `bash .cursor/start.sh`.
- The API creates and seeds the `TayseerCms` database on startup (`EnsureCreated`), and in Development it will drop/recreate it on a schema mismatch. Seeded content includes 6 services and 2 offices; the dev admin login is in `appsettings.json` (`admin@tayseer.me`).

### Fahim AI chatbot (optional)
- The chat widget and RAG index call a local Ollama server on `:11434`, which is not installed by default. On API startup you will see `Connection refused (localhost:11434)` and `RAG index not ready` — this is expected and non-fatal; the rest of the site works. To enable it, install Ollama and pull `llama3.2` + `nomic-embed-text` (see `README.md`).

### Tooling notes
- No ESLint config exists; the web app uses Prettier (config in `package.json`) and `ng test` (Vitest). There is no automated test project for the API.
