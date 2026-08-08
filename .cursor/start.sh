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
