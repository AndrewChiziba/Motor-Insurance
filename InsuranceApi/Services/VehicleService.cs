using AutoMapper;
using Microsoft.EntityFrameworkCore;
using InsuranceApi.DTOs;
using InsuranceApi.Models;
using InsuranceApi.Interfaces;
using InsuranceApi.Data;

namespace InsuranceApi.Services;

public class VehicleService : IVehicleService
{
    private readonly InsuranceDbContext _context;
    private readonly IMapper _mapper;

    public VehicleService(InsuranceDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // Search for vehicle by registration number
    public async Task<VehicleDto?> GetByRegistrationNumberAsync(string registrationNumber)
    {
        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.RegistrationNumber == registrationNumber);
        return _mapper.Map<VehicleDto>(vehicle);
    }

    // Add a new vehicle
    public async Task<VehicleDto> AddAsync(CreateVehicleDto createDto)
    {
        var vehicle = _mapper.Map<Vehicle>(createDto);
        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();
        return _mapper.Map<VehicleDto>(vehicle);
    }
}