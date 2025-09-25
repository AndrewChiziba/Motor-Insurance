using InsuranceApi.Models;
namespace InsuranceApi.DTOs;

public class VehicleDto
{
    public Guid Id { get; set; }
    public string RegistrationNumber { get; set; } = string.Empty;
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public VehicleType Type { get; set; }
}

public class CreateVehicleDto
{
    public string RegistrationNumber { get; set; } = string.Empty;
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public VehicleType Type { get; set; }
}

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "Client"; // Client or Admin
}

public class CreateInsuranceQuoteDto
{
    public Guid VehicleId { get; set; }
    public InsuranceType InsuranceType { get; set; }
    public DateTime StartDate { get; set; }
    public int DurationQuarters { get; set; } // Max 4 quarters
}

public class InsuranceQuoteDto
{
    public Guid VehicleId { get; set; }
    public InsuranceType InsuranceType { get; set; }
    public DateTime StartDate { get; set; }
    public int DurationQuarters { get; set; }
    public decimal Amount { get; set; }
}

public class CreateInsurancePolicyDto
{
    public Guid QuoteId { get; set; }
    public bool ProceedWithOverlap { get; set; } = false;
}

public class InsurancePolicyDto
{
    public Guid Id { get; set; }
    public Guid VehicleId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public InsuranceType Type { get; set; }
    public DateTime StartDate { get; set; }
    public int DurationQuarters { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CreatePaymentDto
{
    public Guid PolicyId { get; set; }
    public string Method { get; set; } = string.Empty; // Card or MobileMoney
}

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid PolicyId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}