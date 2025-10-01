using AutoMapper;
using Microsoft.EntityFrameworkCore;
using InsuranceApi.DTOs;
using InsuranceApi.Models;
using InsuranceApi.Interfaces;
using InsuranceApi.Data;

namespace InsuranceApi.Services;

public class PaymentService : IPaymentService
{
    private readonly InsuranceDbContext _context;
    private readonly IMapper _mapper;

    public PaymentService(InsuranceDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // Simulate payment and update policy
    public async Task<PaymentDto> ProcessPaymentAsync(CreatePaymentDto createDto, string userId)
    {
        var insurancePolicy = await _context.InsurancePolicies.FindAsync(createDto.InsurancePolicyId) ?? throw new Exception("Policy not found");
        var now = DateTime.UtcNow;

        var payment = new Payment
        {
            UserId = userId,
            InsurancePolicyId = createDto.InsurancePolicyId,
            Amount = insurancePolicy.Amount,
            PaymentMethod = createDto.PaymentMethod,
            PaymentDate = now,
            Status = "Completed" // Simulate successful payment
        };
        _context.Payments.Add(payment);

        insurancePolicy.Status = "Active";
        await _context.SaveChangesAsync();

        return _mapper.Map<PaymentDto>(payment);
    }
}