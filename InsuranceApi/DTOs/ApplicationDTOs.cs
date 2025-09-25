using InsuranceApi.Models;

namespace InsuranceApi.DTOs;

public record VehicleDto(
    Guid Id,
    string RegistrationNumber,
    string Make,
    string Model,
    int Year,
    VehicleType Type
);

public record CreateVehicleDto(
    string RegistrationNumber,
    string Make,
    string Model,
    int Year,
    VehicleType Type
);

public class UpdateVehicleDto
{
    public string? Make { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public VehicleType? Type { get; set; }
}
public record LoginDto(
    string Email,
    string Password
);

public record RegisterDto(
    string Email,
    string Password,
    string FullName
);

public record AuthResponseDto(
    string Token,
    string Expires,
    string Role,
    string Email
);

public record CreateInsuranceQuoteDto(
    Guid VehicleId,
    InsuranceType InsuranceType,
    DateTime StartDate,
    int DurationQuarters
);

public record InsuranceQuoteDto(
    Guid VehicleId,
    InsuranceType InsuranceType,
    DateTime StartDate,
    int DurationQuarters,
    decimal Amount
);

public record CreateInsurancePolicyDto(
    Guid QuoteId,
    bool ProceedWithOverlap = false
);

public record InsurancePolicyDto(
    Guid Id,
    Guid VehicleId,
    string UserId,
    InsuranceType Type,
    DateTime StartDate,
    int DurationQuarters,
    decimal Amount,
    string Status
);

public record CreatePaymentDto(
    Guid PolicyId,
    string Method // Card or MobileMoney
);

public record PaymentDto(
    Guid Id,
    Guid PolicyId,
    decimal Amount,
    string Method,
    string Status
);
