using System.ComponentModel.DataAnnotations;
using System.Security.AccessControl;

namespace InsuranceApi.Models;

public class Payment
{
    public Guid Id { get; set; }
    public string UserId { get; set; }
    public Guid InsurancePolicyId { get; set; }

    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }

    [MaxLength(50)]
    public string PaymentMethod { get; set; } = string.Empty; // Card or MobileMoney

    [MaxLength(50)]
    public string Status { get; set; } = "Pending";
}