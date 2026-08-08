#!/usr/bin/env bash
# Per-boot startup for Tayseer: launch the local SQL Server daemon and wait until it
# accepts connections. Idempotent — a no-op if SQL Server is already running.
set -euo pipefail

SA_PASSWORD_FILE="/var/opt/mssql/.sa_password"
LOG_FILE="/tmp/mssql.log"

log() { echo "[start] $*"; }

if ! dpkg -l mssql-server >/dev/null 2>&1; then
  echo "[start] ERROR: SQL Server is not installed. Run .cursor/install.sh first." >&2
  exit 1
fi

if pgrep -x sqlservr >/dev/null 2>&1; then
  log "SQL Server already running."
else
  # Overlayfs O_DIRECT workaround: after an environment build/snapshot restore, the
  # SQL Server data files live on an overlay lower layer. SQL Server opens them
  # read-only with O_DIRECT, which fails (Error 87) on un-copied-up overlay files.
  # Opening each file read-write forces an overlay copy-up into the writable upper
  # layer so the subsequent O_DIRECT reads succeed. Only runs while SQL Server is
  # stopped, so it never races the live engine.
  if sudo test -d /var/opt/mssql/data; then
    log "Ensuring SQL Server data files are on the writable layer (overlay copy-up)..."
    sudo find /var/opt/mssql/data -type f -exec sh -c 'for f do : 3<>"$f"; done' _ {} + 2>/dev/null || true
  fi

  log "Starting SQL Server..."
  SA_PASSWORD="$(sudo cat "$SA_PASSWORD_FILE" 2>/dev/null || true)"
  # Launch detached so this script can return; the process survives for the VM's lifetime.
  sudo -u mssql env ACCEPT_EULA=Y MSSQL_SA_PASSWORD="$SA_PASSWORD" \
    setsid /opt/mssql/bin/sqlservr >"$LOG_FILE" 2>&1 < /dev/null &
  disown || true
fi

log "Waiting for SQL Server to accept connections on port 1433..."
for _ in $(seq 1 60); do
  if (exec 3<>/dev/tcp/127.0.0.1/1433) 2>/dev/null; then
    exec 3>&- 2>/dev/null || true
    log "SQL Server is ready."
    exit 0
  fi
  sleep 2
done

echo "[start] ERROR: SQL Server did not become ready in time; see $LOG_FILE" >&2
exit 1
