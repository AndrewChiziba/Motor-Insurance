using System.ComponentModel.DataAnnotations;

namespace InsuranceApi.Models;

public class Payment
{
    public Guid Id { get; set; }

    public Guid PolicyId { get; set; }
    public InsurancePolicy? Policy { get; set; }

    public decimal Amount { get; set; }

    [MaxLength(50)]
    public string Method { get; set; } = string.Empty; // Card or MobileMoney

    [MaxLength(50)]
    public string Status { get; set; } = "Pending";
}