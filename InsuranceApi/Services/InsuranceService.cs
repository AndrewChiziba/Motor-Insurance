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
    public async Task<InsuranceQuoteResponseDto> GetQuoteAsync(CreateInsuranceQuoteDto createQuoteDto)
    {
        // Get vehicle
        var vehicle = await _context.Vehicles.FindAsync(createQuoteDto.VehicleId);
        if (vehicle == null)
        {
            throw new ArgumentException("Vehicle not found");
        }

        // Get matching insurance rate
        var rate = await _context.InsuranceRates
            .FirstOrDefaultAsync(r => r.VehicleType == vehicle.Type && r.InsuranceType == createQuoteDto.InsuranceType);

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
            createQuoteDto.InsuranceType,
            quotes
        );
    }


    // Check if vehicle has active insurance
    public async Task<ActivePolicyResponseDto> GetActivePolicyAsync(Guid vehicleId)
    {
        var now = DateTime.UtcNow;

        var policy = await _context.InsurancePolicies
            .Where(p => p.VehicleId == vehicleId &&
                        p.StartDate <= now &&
                        p.EndDate >= now && p.Status == "Active")
            .OrderByDescending(p => p.StartDate)
            .FirstOrDefaultAsync();

        if (policy == null)
        {
            return new ActivePolicyResponseDto { HasActive = false };
        }

        return new ActivePolicyResponseDto
        {
            HasActive = true,
            Type = (int)policy.Type,
            StartDate = policy.StartDate,
            EndDate = policy.EndDate,
            Amount = policy.Amount
        };
    }

    // Create insurance policy after overlap check
    public async Task<InsurancePolicyDto> CreatePolicyAsync(CreateInsurancePolicyDto createInsuranceDto, string userId)
    {
        // ensure vehicle exists
        var vehicle = await _context.Vehicles.FindAsync(createInsuranceDto.VehicleId);
        if (vehicle == null)
            throw new Exception("Vehicle not found");

        // optional: check for overlap
        // if (!dto.ProceedWithOverlap)
        // {
        //     var hasActive = await _context.InsurancePolicies.AnyAsync(p =>
        //         p.VehicleId == dto.VehicleId &&
        //         p.StartDate <= dto.StartDate &&
        //         p.EndDate >= dto.StartDate &&
        //         p.Status == "Active"
        //     );

        //     if (hasActive)
        //         throw new Exception("Active policy already exists for this vehicle");
        // }

        var insurancePolicy = new InsurancePolicy
        {
            VehicleId = createInsuranceDto.VehicleId,
            UserId = userId,
            Type = createInsuranceDto.InsuranceType,
            StartDate = createInsuranceDto.StartDate,
            EndDate = createInsuranceDto.StartDate.AddMonths(createInsuranceDto.DurationQuarters * 3),
            DurationQuarters = createInsuranceDto.DurationQuarters,
            Amount = createInsuranceDto.Amount,
            Status = "Pending" // will flip to Active after payment
        };

        _context.InsurancePolicies.Add(insurancePolicy);
        await _context.SaveChangesAsync();

        return _mapper.Map<InsurancePolicyDto>(insurancePolicy);
    }

    // InsuranceService.cs
    // public async Task<InsurancePolicyDto> ActivatePolicyAsync(Guid policyId)
    // {
    //     var policy = await _context.InsurancePolicies.FindAsync(policyId);
    //     if (policy == null) throw new Exception("Policy not found");

    //     policy.Status = "Active";
    //     await _context.SaveChangesAsync();

    //     return _mapper.Map<InsurancePolicyDto>(policy);
    // }


    // Get all policies for a specific user
    public async Task<IEnumerable<InsurancePolicyDto>> GetPoliciesForUserAsync(string userId)
    {
        var now = DateTime.UtcNow;
        var policies = await _context.InsurancePolicies
            .Where(p => p.UserId == userId && p.EndDate >= now)
            .ToListAsync();

        return _mapper.Map<IEnumerable<InsurancePolicyDto>>(policies);
    }
}