using InsuranceApi.DTOs;

namespace InsuranceApi.Interfaces;
public interface IPaymentService
{
    Task<PaymentDto> ProcessPaymentAsync(CreatePaymentDto createDto, string userId); // Simulate payment and update policy
}