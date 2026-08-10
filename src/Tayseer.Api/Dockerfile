# Build from repo root:
#   docker build -f src/Tayseer.Api/Dockerfile -t tayseer-api .
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/Tayseer.Api/Tayseer.Api.csproj src/Tayseer.Api/
RUN dotnet restore src/Tayseer.Api/Tayseer.Api.csproj

COPY src/Tayseer.Api/ src/Tayseer.Api/
RUN dotnet publish src/Tayseer.Api/Tayseer.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV PORT=8080
EXPOSE 8080

COPY --from=build /app/publish .
CMD ["sh", "-c", "ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080} exec dotnet Tayseer.Api.dll"]
