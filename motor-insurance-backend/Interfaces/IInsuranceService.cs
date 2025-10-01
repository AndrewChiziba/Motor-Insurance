using InsuranceApi.DTOs;

namespace InsuranceApi.Interfaces;

public interface IInsuranceService
{
   Task<InsuranceQuoteResponseDto> GetQuoteAsync(CreateInsuranceQuoteDto createDto); // Calculate quote
    Task<InsurancePolicyDto> CreatePolicyAsync(CreateInsurancePolicyDto createDto, string userId); // Create policy with overlap check
    Task<ActivePolicyResponseDto> GetActivePolicyAsync(Guid vehicleId); // Check for active policies
    Task<IEnumerable<InsurancePolicyDto>> GetPoliciesForUserAsync(string userId); // Get client's policies
}