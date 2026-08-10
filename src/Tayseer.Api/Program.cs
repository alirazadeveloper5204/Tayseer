using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http.Connections;
using Tayseer.Api.Contracts;
using Tayseer.Api.Data;
using Tayseer.Api.Domain;
using Tayseer.Api.Endpoints;
using Tayseer.Api.Hubs;
using Tayseer.Api.Options;
using Tayseer.Api.Services;
using Tayseer.Api.Services.Rag;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\mssqllocaldb;Database=TayseerCms;Trusted_Connection=True;TrustServerCertificate=True";

var databaseProvider = ResolveDatabaseProvider(builder.Configuration, connectionString);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (databaseProvider == "Npgsql")
    {
        options.UseNpgsql(NormalizePostgresConnectionString(connectionString));
    }
    else
    {
        options.UseSqlServer(connectionString);
    }
});

builder.Services.Configure<OllamaOptions>(builder.Configuration.GetSection(OllamaOptions.SectionName));
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.Configure<AdminSeedOptions>(builder.Configuration.GetSection(AdminSeedOptions.SectionName));

var jwt = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrWhiteSpace(jwt.SigningKey) || jwt.SigningKey.Length < 32)
{
    throw new InvalidOperationException(
        "Configure Jwt:SigningKey (at least 32 characters) in appsettings or user secrets.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SigningKey)),
            ClockSkew = TimeSpan.FromMinutes(1),
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/agent-chat"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            },
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddSignalR();
builder.Services.AddScoped<IPasswordHasher<AdminUser>, PasswordHasher<AdminUser>>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AgentChatService>();

void ConfigureOllamaClient(IServiceProvider sp, HttpClient client)
{
    var ollama = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<OllamaOptions>>().Value;
    client.BaseAddress = new Uri(ollama.BaseUrl.TrimEnd('/') + "/");
    client.Timeout = TimeSpan.FromSeconds(Math.Clamp(ollama.TimeoutSeconds, 15, 300));
}

builder.Services.AddHttpClient<OllamaChatService>(ConfigureOllamaClient);
builder.Services.AddHttpClient<OllamaEmbeddingClient>(ConfigureOllamaClient);

builder.Services.AddSingleton<InMemoryKnowledgeIndex>();
builder.Services.AddScoped<CmsKnowledgeBuilder>();
builder.Services.AddScoped<KnowledgeIndexService>();

var corsOrigins = builder.Configuration.GetSection("Cors:AngularOrigins").Get<string[]>()
    ?? ["http://localhost:4200", "https://localhost:4200", "http://127.0.0.1:4200"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularApp", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
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

app.UseCors("AngularApp");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () =>
        Results.Ok(new HealthDto("Healthy", "Tayseer.Api", DateTimeOffset.UtcNow)))
    .WithName("Health")
    .WithTags("Ops");

app.MapHealthChecks("/health/ready");

app.MapPublicContentEndpoints();
app.MapAuthEndpoints();
app.MapAdminContentEndpoints();
app.MapChatEndpoints();
app.MapAgentChatEndpoints();
app.MapContactEndpoints();
app.MapHub<AgentChatHub>("/hubs/agent-chat", options =>
{
    options.Transports = HttpTransportType.WebSockets | HttpTransportType.LongPolling;
});

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
    try
    {
        _ = await db.AgentConversations.AsNoTracking().AnyAsync();
        _ = await db.ContactInquiries.AsNoTracking().AnyAsync();
        await ContentSeeder.EnsureSeedAsync(db);
        await AuthSeeder.EnsureSeedAsync(
            db,
            scope.ServiceProvider.GetRequiredService<Microsoft.Extensions.Options.IOptions<AdminSeedOptions>>(),
            scope.ServiceProvider.GetRequiredService<IPasswordHasher<AdminUser>>());
    }
    catch (Exception ex) when (app.Environment.IsDevelopment())
    {
        app.Logger.LogWarning(ex, "Recreating local CMS database for schema update");
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
        await ContentSeeder.EnsureSeedAsync(db);
        await AuthSeeder.EnsureSeedAsync(
            db,
            scope.ServiceProvider.GetRequiredService<Microsoft.Extensions.Options.IOptions<AdminSeedOptions>>(),
            scope.ServiceProvider.GetRequiredService<IPasswordHasher<AdminUser>>());
    }

    var ollama = scope.ServiceProvider.GetRequiredService<Microsoft.Extensions.Options.IOptions<OllamaOptions>>().Value;
    if (ollama.RagEnabled)
    {
        try
        {
            var knowledge = scope.ServiceProvider.GetRequiredService<KnowledgeIndexService>();
            var count = await knowledge.RebuildAsync(CancellationToken.None);
            app.Logger.LogInformation("RAG index ready ({Count} chunks)", count);
        }
        catch (Exception ex)
        {
            app.Logger.LogWarning(
                ex,
                "RAG index not ready. Chat will run without retrieval until Ollama embeddings work. Pull with: ollama pull {Model}",
                ollama.EmbeddingModel);
        }
    }
}

app.Run();

static string ResolveDatabaseProvider(IConfiguration configuration, string connectionString)
{
    var configured = configuration["Database:Provider"];
    if (!string.IsNullOrWhiteSpace(configured))
    {
        return configured.Equals("Npgsql", StringComparison.OrdinalIgnoreCase)
            || configured.Equals("Postgres", StringComparison.OrdinalIgnoreCase)
            || configured.Equals("PostgreSQL", StringComparison.OrdinalIgnoreCase)
            ? "Npgsql"
            : "SqlServer";
    }

    return LooksLikePostgres(connectionString) ? "Npgsql" : "SqlServer";
}

static bool LooksLikePostgres(string connectionString) =>
    connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase)
    || connectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase)
    || (connectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase)
        && !connectionString.Contains("Server=", StringComparison.OrdinalIgnoreCase));

static string NormalizePostgresConnectionString(string connectionString)
{
    // Render / Neon URI form works with Npgsql once the scheme is postgresql://
    if (connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
    {
        return "postgresql://" + connectionString["postgres://".Length..];
    }

    return connectionString;
}
