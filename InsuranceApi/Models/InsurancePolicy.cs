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

    public DateTime EndDate => StartDate.AddMonths(DurationQuarters * 3);

    public decimal Amount { get; set; }

    public bool IsActive => DateTime.UtcNow >= StartDate && DateTime.UtcNow <= EndDate;

    [MaxLength(50)]
    public string Status { get; set; } = "Active";
}

public enum InsuranceType
{
    Comprehensive,
    ThirdParty
}