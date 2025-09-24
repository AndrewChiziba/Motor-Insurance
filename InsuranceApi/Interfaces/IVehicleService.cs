using InsuranceApi.DTOs;

namespace InsuranceApi.Interfaces;

public interface IVehicleService
{
    Task<VehicleDto?> GetByRegistrationNumberAsync(string registrationNumber); // Search vehicle
    Task<VehicleDto> AddAsync(CreateVehicleDto createDto); // Add new vehicle
}