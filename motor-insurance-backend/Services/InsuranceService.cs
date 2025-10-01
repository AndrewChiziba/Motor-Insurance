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
            new VehicleDto(vehicle.Id, vehicle.RegistrationNumber, vehicle.Make, vehicle.Model, vehicle.Colour, vehicle.Year, vehicle.Type),
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

    // Get clients policies
    public async Task<IEnumerable<ClientPolicyDto>> GetClientPoliciesAsyncToRefactor(string userId)
    {
        var now = DateTime.UtcNow;

        // Get the active policies for the user
        var policies = await _context.InsurancePolicies
            .Where(p => p.UserId == userId && p.EndDate >= now && p.Status == "Active")
            .OrderByDescending(p => p.StartDate)
            .ToListAsync();

        // Get all vehicle IDs from the policies
        var vehicleIds = policies.Select(p => p.VehicleId).Distinct().ToList();

        // Get all vehicles in one query
        var vehicles = await _context.Vehicles
            .Where(v => vehicleIds.Contains(v.Id))
            .ToDictionaryAsync(v => v.Id, v => v);

        // Combine policies with their vehicles
        return policies.Select(p =>
        {
            var vehicle = vehicles.GetValueOrDefault(p.VehicleId);

            return new ClientPolicyDto(
                PolicyId: p.Id,
                RegistrationNumber: vehicle?.RegistrationNumber ?? "N/A",
                Make: vehicle?.Make ?? "N/A",
                Model: vehicle?.Model ?? "N/A",
                Colour: vehicle?.Colour ?? "N/A",
                Year: vehicle?.Year ?? 0,
                VehicleType: vehicle != null ? (int)vehicle.Type : 0,
                InsuranceType: (int)p.Type,
                StartDate: p.StartDate,
                EndDate: p.EndDate,
                Amount: p.Amount,
                Status: p.Status,
                DurationQuarters: p.DurationQuarters
            );
        });
    }
    public async Task<IEnumerable<ClientPolicyDto>> GetClientPoliciesAsync(string userId)
    {
        var now = DateTime.UtcNow;

        var policyData = await (from policy in _context.InsurancePolicies
                                join vehicle in _context.Vehicles on policy.VehicleId equals vehicle.Id
                                where policy.UserId == userId &&
                                      policy.EndDate >= now &&
                                      policy.Status == "Active"
                                orderby policy.StartDate descending
                                select new
                                {
                                    Policy = policy,
                                    Vehicle = vehicle
                                }).ToListAsync();

        return policyData.Select(x => new ClientPolicyDto(
            PolicyId: x.Policy.Id,
            RegistrationNumber: x.Vehicle.RegistrationNumber,
            Make: x.Vehicle.Make,
            Model: x.Vehicle.Model,
            Colour: x.Vehicle.Colour,
            Year: x.Vehicle.Year,
            VehicleType: (int)x.Vehicle.Type,
            InsuranceType: (int)x.Policy.Type,
            StartDate: x.Policy.StartDate,
            EndDate: x.Policy.EndDate,
            Amount: x.Policy.Amount,
            Status: x.Policy.Status,
            DurationQuarters: x.Policy.DurationQuarters
        ));
    }
}