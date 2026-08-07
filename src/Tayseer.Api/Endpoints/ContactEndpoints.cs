using System.ComponentModel.DataAnnotations;
using Tayseer.Api.Contracts;
using Tayseer.Api.Data;
using Tayseer.Api.Domain;

namespace Tayseer.Api.Endpoints;

public static class ContactEndpoints
{
    public static RouteGroupBuilder MapContactEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Contact");

        group.MapPost("/contact", async (
            ContactInquiryRequestDto request,
            AppDbContext db,
            ILoggerFactory loggerFactory,
            CancellationToken ct) =>
        {
            var logger = loggerFactory.CreateLogger("Contact");
            var name = (request.Name ?? string.Empty).Trim();
            var email = (request.Email ?? string.Empty).Trim();
            var interest = (request.Interest ?? string.Empty).Trim();
            var message = (request.Message ?? string.Empty).Trim();
            var company = string.IsNullOrWhiteSpace(request.Company) ? null : request.Company.Trim();
            var lang = string.Equals(request.Lang, "ar", StringComparison.OrdinalIgnoreCase) ? "ar" : "en";

            if (name.Length < 2 || name.Length > 120)
            {
                return Results.BadRequest(new { error = "name_invalid" });
            }

            if (email.Length is < 5 or > 200 || !new EmailAddressAttribute().IsValid(email))
            {
                return Results.BadRequest(new { error = "email_invalid" });
            }

            if (interest.Length is < 1 or > 80)
            {
                return Results.BadRequest(new { error = "interest_invalid" });
            }

            if (message.Length is < 1 or > 4000)
            {
                return Results.BadRequest(new { error = "message_invalid" });
            }

            if (company is { Length: > 200 })
            {
                return Results.BadRequest(new { error = "company_invalid" });
            }

            var entity = new ContactInquiry
            {
                Id = Guid.NewGuid(),
                Name = name,
                Email = email,
                Company = company,
                Interest = interest,
                Message = message,
                Lang = lang,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            db.ContactInquiries.Add(entity);
            await db.SaveChangesAsync(ct);

            logger.LogInformation("Contact inquiry {Id} from {Email}", entity.Id, entity.Email);

            return Results.Created(
                $"/api/v1/contact/{entity.Id}",
                new ContactInquiryResponseDto(entity.Id, entity.CreatedAt));
        })
        .WithName("SubmitContactInquiry");

        return group;
    }
}
