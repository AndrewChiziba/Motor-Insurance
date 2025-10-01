using InsuranceApi.DTOs;
using InsuranceApi.Models;

namespace InsuranceApi.Interfaces
{
    public interface IAdminService
    {
        // Vehicle Operations
        Task<(List<Vehicle> vehicles, int totalCount)> GetVehiclesAsync(string? search, int page);
        Task<Vehicle?> GetVehicleByIdAsync(Guid id);
        Task<Vehicle?> UpdateVehicleAsync(Guid id, UpdateVehicleDto updateVehicleDto);
        Task<bool> DeleteVehicleAsync(Guid id);

        // Insurance Rate Operations
        Task<List<InsuranceRate>> GetInsuranceRatesAsync();
        Task<InsuranceRate?> UpdateInsuranceRateAsync(Guid id, UpdateInsuranceRateDto updateRateDto);

        // records Operations
        // Task<List<InsurancePolicy>> GetActivePoliciesAsync();
        // Task<List<Payment>> GetPaymentsAsync();

        // User Operations
        Task<bool> CreateAdminAsync(CreateAdminDto createAdminDto);
    }
}