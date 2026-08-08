#!/usr/bin/env bash
# Idempotent Cloud Agent install for Tayseer (Angular 21 SSR web + .NET 10 API + SQL Server).
# Installs system toolchains (.NET 10 SDK, SQL Server 2022), restores project dependencies,
# and initializes a local SQL Server instance. Safe to run repeatedly.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOTNET_INSTALL_DIR="/usr/share/dotnet"
DB_ENV_FILE="$HOME/.tayseer-db.env"
SA_PASSWORD_FILE="/var/opt/mssql/.sa_password"
MSSQL_DATA="/var/opt/mssql/data/master.mdf"

log() { echo "[install] $*"; }

# ---------------------------------------------------------------------------
# 1. .NET 10 SDK
# ---------------------------------------------------------------------------
if command -v dotnet >/dev/null 2>&1 && dotnet --list-sdks 2>/dev/null | grep -q '^10\.'; then
  log ".NET 10 SDK already present: $(dotnet --version)"
else
  log "Installing .NET 10 SDK..."
  curl -fsSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
  chmod +x /tmp/dotnet-install.sh
  sudo /tmp/dotnet-install.sh --channel 10.0 --install-dir "$DOTNET_INSTALL_DIR"
  sudo ln -sf "$DOTNET_INSTALL_DIR/dotnet" /usr/local/bin/dotnet
  log ".NET SDK installed: $(dotnet --version)"
fi

# ---------------------------------------------------------------------------
# 2. SQL Server 2022 (app hardcodes the SQL Server EF Core provider)
# ---------------------------------------------------------------------------
if ! dpkg -l mssql-server >/dev/null 2>&1; then
  log "Installing SQL Server 2022..."
  curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
    | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc >/dev/null
  # Only the Ubuntu 22.04 (jammy) feed exists for mssql-server; it works on 24.04.
  curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list \
    | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list >/dev/null
  sudo apt-get update
  sudo ACCEPT_EULA=Y apt-get install -y mssql-server
else
  log "SQL Server already installed."
fi

# SQL Server 2022 needs the OpenLDAP 2.5 runtime, which Ubuntu 24.04 ships as 2.6.
# Pull just the 2.5 shared objects from the jammy package (no conflict with system 2.6).
if [ ! -f /usr/lib/x86_64-linux-gnu/liblber-2.5.so.0 ]; then
  log "Installing OpenLDAP 2.5 runtime libraries for SQL Server..."
  POOL="http://archive.ubuntu.com/ubuntu/pool/main/o/openldap/"
  DEB=$(curl -fsSL "$POOL" | grep -oE 'libldap-2\.5-0_[^"]*_amd64\.deb' | sort -V | tail -1)
  if [ -z "$DEB" ]; then
    echo "[install] ERROR: could not locate libldap-2.5-0 package" >&2
    exit 1
  fi
  curl -fsSL -o "/tmp/$DEB" "$POOL$DEB"
  rm -rf /tmp/ldap-extract && mkdir -p /tmp/ldap-extract
  dpkg-deb -x "/tmp/$DEB" /tmp/ldap-extract
  sudo cp -a /tmp/ldap-extract/usr/lib/x86_64-linux-gnu/lib*-2.5.so.* /usr/lib/x86_64-linux-gnu/
  sudo ldconfig
fi

# ---------------------------------------------------------------------------
# 3. Initialize the local SQL Server instance (first run only)
# ---------------------------------------------------------------------------
if ! sudo test -f "$MSSQL_DATA"; then
  log "Initializing SQL Server system databases..."
  # Dev-only SA password, generated locally and never committed.
  SA_PASSWORD="Dev_$(openssl rand -hex 8)_Ts1!"
  echo "$SA_PASSWORD" | sudo tee "$SA_PASSWORD_FILE" >/dev/null
  sudo chown mssql:mssql "$SA_PASSWORD_FILE"
  sudo chmod 600 "$SA_PASSWORD_FILE"

  sudo -u mssql env ACCEPT_EULA=Y MSSQL_SA_PASSWORD="$SA_PASSWORD" MSSQL_PID=Developer \
    /opt/mssql/bin/sqlservr >/tmp/mssql-init.log 2>&1 &
  INIT_PID=$!
  log "Waiting for SQL Server first-run initialization..."
  for _ in $(seq 1 60); do
    if grep -q "SQL Server is now ready for client connections" /tmp/mssql-init.log 2>/dev/null; then
      break
    fi
    sleep 2
  done
  if ! grep -q "SQL Server is now ready for client connections" /tmp/mssql-init.log 2>/dev/null; then
    echo "[install] ERROR: SQL Server did not initialize; see /tmp/mssql-init.log" >&2
    sudo tail -20 /tmp/mssql-init.log >&2 || true
    exit 1
  fi
  # Stop the init instance; start.sh owns the long-running process per boot.
  sudo kill "$INIT_PID" 2>/dev/null || true
  wait "$INIT_PID" 2>/dev/null || true
  log "SQL Server initialized."
else
  log "SQL Server already initialized."
fi

# Write the connection string (with the local SA password) to a VM-only env file.
SA_PASSWORD="$(sudo cat "$SA_PASSWORD_FILE")"
cat > "$DB_ENV_FILE" <<EOF
export ConnectionStrings__DefaultConnection="Server=127.0.0.1,1433;Database=TayseerCms;User Id=sa;Password=${SA_PASSWORD};TrustServerCertificate=True;Encrypt=False;MultipleActiveResultSets=true"
EOF
chmod 600 "$DB_ENV_FILE"
log "Wrote DB connection env to $DB_ENV_FILE"

# ---------------------------------------------------------------------------
# 4. Project dependencies
# ---------------------------------------------------------------------------
log "Restoring .NET API..."
dotnet build "$REPO_ROOT/src/Tayseer.Api/Tayseer.Api.csproj" -c Debug

log "Installing Angular web dependencies..."
if [ -f "$REPO_ROOT/src/Tayseer.Web/package-lock.json" ]; then
  (cd "$REPO_ROOT/src/Tayseer.Web" && npm ci)
else
  (cd "$REPO_ROOT/src/Tayseer.Web" && npm install)
fi

log "Install complete."
