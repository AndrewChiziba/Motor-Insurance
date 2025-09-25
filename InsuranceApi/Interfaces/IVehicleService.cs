using InsuranceApi.DTOs;

namespace InsuranceApi.Interfaces
{
    public interface IVehicleService
    {
        Task<IEnumerable<VehicleDto>> GetAllAsync(); // List all vehicles
        Task<VehicleDto?> GetByIdAsync(Guid id); // Get vehicle by ID
        Task<VehicleDto?> GetByRegistrationNumberAsync(string registrationNumber); // Search by reg number
        Task<VehicleDto> AddAsync(CreateVehicleDto createDto); // Add new vehicle
        Task<VehicleDto?> UpdateAsync(Guid id, UpdateVehicleDto updateDto); // Update vehicle
        Task<bool> DeleteAsync(Guid id); // Delete vehicle
    }
}
