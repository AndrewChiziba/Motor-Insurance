namespace InsuranceApi.Models;

public class Quotation
{
    public Guid Id { get; set; }

    public Guid VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    public string UserId { get; set; }

    public InsuranceType InsuranceType { get; set; }

    public DateTime StartDate { get; set; }

    public int DurationQuarters { get; set; }

    public decimal Amount { get; set; }
}