using System.ComponentModel.DataAnnotations;

namespace InsuranceApi.Models;
public class Vehicle
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string RegistrationNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Make { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public VehicleType Type { get; set; } // Private or Commercial
}

public enum VehicleType
{
    Private,
    Commercial
}