using System.ComponentModel.DataAnnotations;

namespace InsuranceApi.Models;

public class InsurancePolicy
{
    public Guid Id { get; set; }

    public Guid VehicleId { get; set; }

    public string UserId { get; set; } = string.Empty;

    public InsuranceType Type { get; set; }

    public DateTime StartDate { get; set; }

    public int DurationQuarters { get; set; }

    public DateTime EndDate { get; set; }

    public decimal Amount { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = "InActive";
}

public enum InsuranceType
{
    Comprehensive,
    ThirdParty
}