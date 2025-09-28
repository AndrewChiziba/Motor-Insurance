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
    public async Task<InsuranceQuoteResponseDto> GetQuoteAsync(CreateInsuranceQuoteDto createDto)
    {
        // Get vehicle
        var vehicle = await _context.Vehicles.FindAsync(createDto.VehicleId);
        if (vehicle == null)
        {
            throw new ArgumentException("Vehicle not found");
        }

        // Get matching insurance rate
        var rate = await _context.InsuranceRates
            .FirstOrDefaultAsync(r => r.VehicleType == vehicle.Type && r.InsuranceType == createDto.InsuranceType);

        if (rate == null || rate.RatePerQuarter <= 0)
        {
            throw new InvalidOperationException("No valid rate configured for this vehicle type and insurance type");
        }

        var startDate = DateTime.UtcNow.Date;

        // Generate quotes for 1–4 quarters
        var quotes = Enumerable.Range(1, 4).Select(q =>
            new QuarterQuoteDto(
                Quarters: q,
                StartDate: startDate,
                EndDate: startDate.AddMonths(q * 3),
                Amount: rate.RatePerQuarter * q
            )
        ).ToList();

        return new InsuranceQuoteResponseDto(
            new VehicleDto(vehicle.Id, vehicle.RegistrationNumber, vehicle.Make, vehicle.Model, vehicle.Year, vehicle.Type),
            createDto.InsuranceType,
            quotes
        );
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