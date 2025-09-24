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
    public async Task<PaymentDto> ProcessPaymentAsync(CreatePaymentDto createDto)
    {
        var policy = await _context.InsurancePolicies.FindAsync(createDto.PolicyId) ?? throw new Exception("Policy not found");

        var payment = new Payment
        {
            PolicyId = createDto.PolicyId,
            Amount = policy.Amount,
            Method = createDto.Method,
            Status = "Completed" // Simulate successful payment
        };
        _context.Payments.Add(payment);

        policy.Status = "Paid";
        await _context.SaveChangesAsync();

        return _mapper.Map<PaymentDto>(payment);
    }
}