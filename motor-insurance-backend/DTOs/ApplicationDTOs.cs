using InsuranceApi.Models;

namespace InsuranceApi.DTOs;

public record VehicleDto(
    Guid Id,
    string RegistrationNumber,
    string Make,
    string Model,
    string Colour,
    int Year,
    VehicleType Type
);

public record CreateVehicleDto(
    string RegistrationNumber,
    string Make,
    string Model,
    string Colour,
    int Year,
    VehicleType Type
);

public class UpdateVehicleDto
{
    public string? Make { get; set; }
    public string? Model { get; set; }
    public string? Colour { get; set; }
    public int? Year { get; set; }
    public VehicleType? Type { get; set; }
}

public class UpdateInsuranceRateDto
{
    public decimal RatePerQuarter { get; set; }
}

public class CreateAdminDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
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
    string Email,
    string FullName
);

public record CreateInsuranceQuoteDto(
    Guid VehicleId,
    InsuranceType InsuranceType,
    DateTime StartDate,
    int DurationQuarters
);

// Marked for removal
public record InsuranceQuoteDto(
    Guid VehicleId,
    InsuranceType InsuranceType,
    DateTime StartDate,
    DateTime EndDate,
    int DurationQuarters,
    decimal Amount
);

public class ActivePolicyResponseDto
{
    public bool HasActive { get; set; }
    public int? Type { get; set; } // 0 = Comprehensive, 1 = Third Party
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal? Amount { get; set; }
}

public record CreateInsurancePolicyDto(
    Guid VehicleId,
    InsuranceType InsuranceType,
    DateTime StartDate,
    int DurationQuarters,
    decimal Amount,
    bool ProceedWithOverlap = false
);

public record InsurancePolicyDto(
    Guid Id,
    Guid VehicleId,
    string UserId,
    InsuranceType Type,
    DateTime StartDate,
    DateTime endDate,
    int DurationQuarters,
    decimal Amount,
    string Status
);
public record QuarterQuoteDto(
    int Quarters,
    DateTime StartDate,
    DateTime EndDate,
    decimal Amount
);

public record InsuranceQuoteResponseDto(
    VehicleDto Vehicle,
    InsuranceType InsuranceType,
    IEnumerable<QuarterQuoteDto> Quotes
);
public record CreatePaymentDto(
    Guid InsurancePolicyId,
    string PaymentMethod // Card or MobileMoney
);

public record PaymentDto(
    Guid Id,
    Guid InsurancePolicyId,
    decimal Amount,
    string PaymentMethod,
    string Status
);

 public record ClientPolicyDto(
        Guid PolicyId,
        string RegistrationNumber,
        string Make,
        string Model,
        string Colour,
        int Year,
        int VehicleType,
        int InsuranceType,
        DateTime StartDate,
        DateTime EndDate,
        decimal Amount,
        string Status,
        int DurationQuarters
    );