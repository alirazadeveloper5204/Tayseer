namespace Tayseer.Api.Contracts;

public sealed record ContactInquiryRequestDto(
    string Name,
    string Email,
    string? Company,
    string Interest,
    string Message,
    string? Lang);

public sealed record ContactInquiryResponseDto(Guid Id, DateTimeOffset CreatedAt);
