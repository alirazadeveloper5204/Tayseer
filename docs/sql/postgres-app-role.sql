-- Least-privilege app role for Tayseer API (PostgreSQL / Neon / self-hosted)
-- Run as a privileged user, then point the API connection string at tayseer_app.
--
-- IMPORTANT:
-- 1) Apply EF migrations first (or let the API start once with the owner account
--    so Migrate/baseline can run). Schema DDL needs elevated rights.
-- 2) Then run this script and switch ConnectionStrings__DefaultConnection to tayseer_app.
-- 3) Future schema changes: temporarily use the owner connection (or a migrator job),
--    run Migrate, then switch back to tayseer_app.
--
-- Note: Some managed hosts (e.g. Render free Postgres) may not allow CREATE ROLE.
-- In that case keep the provided user, or move to Neon/self-hosted where you can.

-- Replace YOUR_DATABASE_NAME and YOUR_STRONG_PASSWORD before running.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'tayseer_app') THEN
    CREATE ROLE tayseer_app LOGIN PASSWORD 'YOUR_STRONG_PASSWORD';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE YOUR_DATABASE_NAME TO tayseer_app;
GRANT USAGE ON SCHEMA public TO tayseer_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO tayseer_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tayseer_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO tayseer_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO tayseer_app;

REVOKE CREATE ON SCHEMA public FROM tayseer_app;
