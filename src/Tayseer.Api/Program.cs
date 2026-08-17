using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
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
using Tayseer.Api.Security;
using Tayseer.Api.Services;
using Tayseer.Api.Services.Rag;

// Render free tier hits inotify limits if ASP.NET watches appsettings for reload.
Environment.SetEnvironmentVariable("DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE", "false");

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
        options.UseNpgsql(NormalizePostgresConnectionString(connectionString, builder.Configuration));
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
                // Prefer HttpOnly cookie (browser admin session).
                if (context.Request.Cookies.TryGetValue(AuthCookie.Name, out var cookieToken)
                    && !string.IsNullOrWhiteSpace(cookieToken))
                {
                    context.Token = cookieToken;
                    return Task.CompletedTask;
                }

                // Optional Authorization: Bearer for non-browser clients / tooling.
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                // Avoid browser basic-auth prompts on API 401 responses.
                context.HandleResponse();
                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                }

                return Task.CompletedTask;
            },
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthPolicies.AdminOnly, policy => policy.RequireRole("Admin"));
});

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // Render / reverse proxies — trust X-Forwarded-* from the edge.
    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(
            new ChatErrorDto("Too many requests. Try again later."),
            token);
    };

    static string ClientKey(HttpContext httpContext) =>
        httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

    options.AddPolicy(RateLimitPolicies.Auth, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            ClientKey(httpContext),
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            }));

    options.AddPolicy(RateLimitPolicies.Contact, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            ClientKey(httpContext),
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            }));

    options.AddPolicy(RateLimitPolicies.Chat, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            ClientKey(httpContext),
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 30,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            }));
});

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

var corsOrigins = (builder.Configuration.GetSection("Cors:AngularOrigins").Get<string[]>()
    ?? ["http://localhost:4200", "https://localhost:4200", "http://127.0.0.1:4200"])
    .Where(static o => !string.IsNullOrWhiteSpace(o))
    .Select(static o => o.Trim().TrimEnd('/'))
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray();

if (corsOrigins.Length == 0)
{
    throw new InvalidOperationException(
        "Configure Cors:AngularOrigins (e.g. Cors__AngularOrigins__0=https://tayseer-web.onrender.com).");
}

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

app.UseForwardedHeaders();
app.UseSecurityHeaders();
app.UseCors("AngularApp");

// Render terminates TLS at the proxy; the container receives HTTP.
// Skip HTTPS redirection so health/API calls aren't redirected oddly behind the load balancer.
if (!app.Environment.IsDevelopment()
    && !string.Equals(
        Environment.GetEnvironmentVariable("DISABLE_HTTPS_REDIRECTION"),
        "true",
        StringComparison.OrdinalIgnoreCase)
    && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("RENDER")))
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();

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
    await DatabaseBootstrap.InitializeAsync(
        db,
        databaseProvider,
        app.Environment.IsDevelopment(),
        app.Logger);

    try
    {
        await ContentSeeder.EnsureSeedAsync(db);
        await AuthSeeder.EnsureSeedAsync(
            db,
            scope.ServiceProvider.GetRequiredService<Microsoft.Extensions.Options.IOptions<AdminSeedOptions>>(),
            scope.ServiceProvider.GetRequiredService<IPasswordHasher<AdminUser>>());
    }
    catch (Exception ex) when (app.Environment.IsDevelopment() && databaseProvider != "Npgsql")
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

static string NormalizePostgresConnectionString(string connectionString, IConfiguration configuration)
{
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException(
            "Postgres connection string is missing. Set ConnectionStrings__DefaultConnection " +
            "(Render: Internal Database URL from the Postgres service).");
    }

    var sslMode = configuration["Database:SslMode"];
    if (string.IsNullOrWhiteSpace(sslMode))
    {
        sslMode = "Require";
    }

    // Default true keeps Render/Neon working without shipping their CA bundle.
    // Set Database__TrustServerCertificate=false when you mount a verifying CA.
    var trustServerCertificate = !string.Equals(
        configuration["Database:TrustServerCertificate"],
        "false",
        StringComparison.OrdinalIgnoreCase);

    // Npgsql's ConnectionStringBuilder rejects URI form (postgres:// / postgresql://).
    // Convert Render/Neon URLs to keyword format and require SSL.
    if (connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase)
        || connectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        var uri = new Uri(connectionString);
        var userInfo = uri.UserInfo.Split(':', 2);
        var username = Uri.UnescapeDataString(userInfo[0]);
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;
        var database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/'));
        var port = uri.IsDefaultPort ? 5432 : uri.Port;

        return string.Join(';',
            $"Host={uri.Host}",
            $"Port={port}",
            $"Database={database}",
            $"Username={username}",
            $"Password={password}",
            $"SSL Mode={sslMode}",
            $"Trust Server Certificate={trustServerCertificate}");
    }

    // Keyword form: only add SSL defaults when not already specified.
    var builder = new Npgsql.NpgsqlConnectionStringBuilder(connectionString);
    if (builder.SslMode is Npgsql.SslMode.Disable or Npgsql.SslMode.Prefer)
    {
        if (Enum.TryParse<Npgsql.SslMode>(sslMode.Replace(" ", ""), ignoreCase: true, out var parsed))
        {
            builder.SslMode = parsed;
        }
        else
        {
            builder.SslMode = Npgsql.SslMode.Require;
        }
    }

    var normalized = builder.ConnectionString;
    if (!normalized.Contains("Trust Server Certificate", StringComparison.OrdinalIgnoreCase)
        && !normalized.Contains("TrustServerCertificate", StringComparison.OrdinalIgnoreCase))
    {
        normalized = normalized.TrimEnd(';') + $";Trust Server Certificate={trustServerCertificate}";
    }

    return normalized;
}
