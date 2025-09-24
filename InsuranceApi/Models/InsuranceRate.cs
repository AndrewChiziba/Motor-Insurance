namespace InsuranceApi.Models;
public class InsuranceRate
{
    public Guid Id { get; set; }

    public VehicleType VehicleType { get; set; }

    public InsuranceType InsuranceType { get; set; }

    public decimal RatePerQuarter { get; set; }
}