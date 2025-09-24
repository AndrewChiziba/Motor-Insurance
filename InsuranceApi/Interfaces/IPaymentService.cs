using InsuranceApi.DTOs;

namespace InsuranceApi.Interfaces;
public interface IPaymentService
{
    Task<PaymentDto> ProcessPaymentAsync(CreatePaymentDto createDto); // Simulate payment and update policy
}