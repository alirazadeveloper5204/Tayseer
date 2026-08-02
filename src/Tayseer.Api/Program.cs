using Microsoft.EntityFrameworkCore;
using Tayseer.Api.Contracts;
using Tayseer.Api.Data;
using Tayseer.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\mssqllocaldb;Database=TayseerCms;Trusted_Connection=True;TrustServerCertificate=True";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200",
                "http://127.0.0.1:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AngularDev");

// Avoid HTTP→HTTPS redirects in local dev (breaks browser CORS on fetch redirects).
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.MapGet("/health", () =>
        Results.Ok(new HealthDto("Healthy", "Tayseer.Api", DateTimeOffset.UtcNow)))
    .WithName("Health")
    .WithTags("Ops");

app.MapHealthChecks("/health/ready");

app.MapPublicContentEndpoints();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
    try
    {
        await ContentSeeder.EnsureSeedAsync(db);
    }
    catch (Exception ex) when (app.Environment.IsDevelopment())
    {
        // Existing LocalDB from Phase 0 may lack ServiceFeatures — rebuild once.
        app.Logger.LogWarning(ex, "Recreating local CMS database for Phase 2 schema");
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
        await ContentSeeder.EnsureSeedAsync(db);
    }
}

app.Run();
