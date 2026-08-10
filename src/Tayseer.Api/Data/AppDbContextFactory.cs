using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Tayseer.Api.Data;

/// <summary>
/// Used by <c>dotnet ef migrations</c> — always generates Postgres-compatible migrations.
/// </summary>
public sealed class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql("Host=127.0.0.1;Database=tayseer_design;Username=tayseer;Password=tayseer")
            .Options;

        return new AppDbContext(options);
    }
}
