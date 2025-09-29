using AutoMapper;
using Microsoft.EntityFrameworkCore;
using InsuranceApi.DTOs;
using InsuranceApi.Models;
using InsuranceApi.Interfaces;
using InsuranceApi.Data;
using System.Security.Cryptography.Xml;

namespace InsuranceApi.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly InsuranceDbContext _context;
        private readonly IMapper _mapper;

        public VehicleService(InsuranceDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Get all vehicles
        public async Task<IEnumerable<VehicleDto>> GetAllAsync()
        {
            var vehicles = await _context.Vehicles.ToListAsync();
            return _mapper.Map<IEnumerable<VehicleDto>>(vehicles);
        }

        // Get vehicle by ID
        public async Task<VehicleDto?> GetByIdAsync(Guid id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            return _mapper.Map<VehicleDto>(vehicle);
        }

        // Search for vehicle by registration number
        public async Task<VehicleDto?> GetByRegistrationNumberAsync(string registrationNumber)
        {
            var vehicle = await _context.Vehicles
                .FirstOrDefaultAsync(v => v.RegistrationNumber == registrationNumber.ToUpper());
            return _mapper.Map<VehicleDto>(vehicle);
        }

        // Add a new vehicle
        public async Task<VehicleDto> AddAsync(CreateVehicleDto createDto)
        {
            // Transform vehicle registration to upper
            var transformedDto = createDto with
            {
                RegistrationNumber = createDto.RegistrationNumber.ToUpper()
            };

            var vehicle = _mapper.Map<Vehicle>(transformedDto);
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return _mapper.Map<VehicleDto>(vehicle);
        }

        // Update existing vehicle
        public async Task<VehicleDto?> UpdateAsync(Guid id, UpdateVehicleDto updateDto)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return null;

            if (!string.IsNullOrWhiteSpace(updateDto.Make)) vehicle.Make = updateDto.Make;
            if (!string.IsNullOrWhiteSpace(updateDto.Model)) vehicle.Model = updateDto.Model;
            if (updateDto.Year.HasValue) vehicle.Year = updateDto.Year.Value;
            if (updateDto.Type.HasValue) vehicle.Type = updateDto.Type.Value;

            await _context.SaveChangesAsync();
            return _mapper.Map<VehicleDto>(vehicle);
        }

        // Delete vehicle
        public async Task<bool> DeleteAsync(Guid id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return false;

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
