using AutoMapper;
using Microsoft.EntityFrameworkCore;
using InsuranceApi.DTOs;
using InsuranceApi.Models;
using InsuranceApi.Interfaces;
using InsuranceApi.Data;

namespace InsuranceApi.Services;

public class InsuranceService : IInsuranceService
{
    private readonly InsuranceDbContext _context;
    private readonly IMapper _mapper;

    public InsuranceService(InsuranceDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // Calculate insurance quote based on rates
    public async Task<InsuranceQuoteDto> GetQuoteAsync(CreateInsuranceQuoteDto createDto)
    {
        if (createDto.DurationQuarters < 1 || createDto.DurationQuarters > 4)
            throw new ArgumentException("Duration must be between 1 and 4 quarters");

        var vehicle = await _context.Vehicles.FindAsync(createDto.VehicleId) ?? throw new Exception("Vehicle not found");
        var rate = await _context.InsuranceRates
            .FirstOrDefaultAsync(r => r.VehicleType == vehicle.Type && r.InsuranceType == createDto.InsuranceType)
            ?? throw new Exception("Rate not found");

        var quotation = new Quotation
        {
            VehicleId = createDto.VehicleId,
            UserId = "temp_user_id", // Will be set in CreatePolicy
            InsuranceType = createDto.InsuranceType,
            StartDate = createDto.StartDate,
            DurationQuarters = createDto.DurationQuarters,
            Amount = rate.RatePerQuarter * createDto.DurationQuarters
        };
        _context.Quotations.Add(quotation);
        await _context.SaveChangesAsync();

        return _mapper.Map<InsuranceQuoteDto>(quotation);
    }

    // Check if vehicle has active insurance
    public async Task<bool> HasActivePolicyAsync(Guid vehicleId)
    {
        return await _context.InsurancePolicies
            .AnyAsync(p => p.VehicleId == vehicleId && p.IsActive);
    }

    // Create insurance policy with overlap check and user context
    public async Task<InsurancePolicyDto> CreatePolicyAsync(CreateInsurancePolicyDto createDto, string userId)
    {
        var quotation = await _context.Quotations.FindAsync(createDto.QuoteId) ?? throw new Exception("Quote not found");
        quotation.UserId = userId; // Update UserId from the authenticated user
        await _context.SaveChangesAsync();

        if (await HasActivePolicyAsync(quotation.VehicleId) && !createDto.ProceedWithOverlap)
            throw new Exception("Vehicle has active policy. Set ProceedWithOverlap to true to continue.");

        var policy = new InsurancePolicy
        {
            VehicleId = quotation.VehicleId,
            UserId = userId,
            Type = quotation.InsuranceType,
            StartDate = quotation.StartDate,
            DurationQuarters = quotation.DurationQuarters,
            Amount = quotation.Amount
        };
        _context.InsurancePolicies.Add(policy);
        await _context.SaveChangesAsync();

        return _mapper.Map<InsurancePolicyDto>(policy);
    }

    // Get all policies for a specific user
    public async Task<IEnumerable<InsurancePolicyDto>> GetPoliciesForUserAsync(string userId)
    {
        var policies = await _context.InsurancePolicies
            .Where(p => p.UserId == userId && p.IsActive)
            .ToListAsync();

        return _mapper.Map<IEnumerable<InsurancePolicyDto>>(policies);
    }
}