using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace Tayseer.Api.Data;

public static class DatabaseBootstrap
{
    /// <summary>
    /// Applies EF migrations on Postgres. If the DB was created earlier with EnsureCreated
    /// (no __EFMigrationsHistory), marks pending migrations as applied without re-creating tables.
    /// Local SQL Server keeps EnsureCreated + optional recreate on schema mismatch.
    /// </summary>
    public static async Task InitializeAsync(
        AppDbContext db,
        string databaseProvider,
        bool isDevelopment,
        ILogger logger,
        CancellationToken ct = default)
    {
        if (databaseProvider.Equals("Npgsql", StringComparison.OrdinalIgnoreCase))
        {
            await ApplyPostgresMigrationsAsync(db, logger, ct);
            return;
        }

        await db.Database.EnsureCreatedAsync(ct);
        try
        {
            _ = await db.AgentConversations.AsNoTracking().AnyAsync(ct);
            _ = await db.ContactInquiries.AsNoTracking().AnyAsync(ct);
        }
        catch (Exception ex) when (isDevelopment)
        {
            logger.LogWarning(ex, "Recreating local CMS database for schema update");
            await db.Database.EnsureDeletedAsync(ct);
            await db.Database.EnsureCreatedAsync(ct);
        }
    }

    private static async Task ApplyPostgresMigrationsAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken ct)
    {
        var pending = (await db.Database.GetPendingMigrationsAsync(ct)).ToList();
        if (pending.Count == 0)
        {
            logger.LogInformation("Postgres schema is up to date (no pending migrations)");
            return;
        }

        var applied = (await db.Database.GetAppliedMigrationsAsync(ct)).ToList();
        if (applied.Count == 0 && await LooksLikeExistingEnsureCreatedSchemaAsync(db, ct))
        {
            logger.LogWarning(
                "Existing Postgres schema detected without EF history — baselining {Count} migration(s) without applying DDL",
                pending.Count);
            await BaselinePendingMigrationsAsync(db, pending, ct);
            return;
        }

        logger.LogInformation("Applying {Count} Postgres migration(s)", pending.Count);
        await db.Database.MigrateAsync(ct);
    }

    private static async Task<bool> LooksLikeExistingEnsureCreatedSchemaAsync(
        AppDbContext db,
        CancellationToken ct)
    {
        var connection = db.Database.GetDbConnection();
        await db.Database.OpenConnectionAsync(ct);
        try
        {
            await using var cmd = connection.CreateCommand();
            cmd.CommandText =
                """
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_name IN ('ServiceOfferings', 'AdminUsers', 'ContactInquiries')
                LIMIT 1
                """;
            var result = await cmd.ExecuteScalarAsync(ct);
            return result is not null && result is not DBNull;
        }
        finally
        {
            await db.Database.CloseConnectionAsync();
        }
    }

    private static async Task BaselinePendingMigrationsAsync(
        AppDbContext db,
        IReadOnlyList<string> pending,
        CancellationToken ct)
    {
        var productVersion =
            typeof(DbContext).Assembly
                .GetCustomAttribute<AssemblyInformationalVersionAttribute>()
                ?.InformationalVersion
                ?.Split('+')[0]
            ?? "10.0.0";

        await db.Database.ExecuteSqlRawAsync(
            """
            CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
                "MigrationId" character varying(150) NOT NULL,
                "ProductVersion" character varying(32) NOT NULL,
                CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
            );
            """,
            ct);

        foreach (var migrationId in pending)
        {
            await db.Database.ExecuteSqlRawAsync(
                """
                INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
                VALUES ({0}, {1})
                ON CONFLICT ("MigrationId") DO NOTHING;
                """,
                migrationId,
                productVersion);
        }
    }
}
