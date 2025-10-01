using System.Text.RegularExpressions;
using InsuranceApi.Data;
using InsuranceApi.DTOs;
using InsuranceApi.Interfaces;
using InsuranceApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InsuranceApi.Services
{
    public class AdminService : IAdminService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly InsuranceDbContext _context;

        public AdminService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration config, InsuranceDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
            _context = context;
        }

        // Vehicle Operations
        public async Task<(List<Vehicle> vehicles, int totalCount)> GetVehiclesAsync(string? search, int page)
        {
            const int pageSize = 15;
            var query = _context.Vehicles.AsQueryable();

            // Apply search filter if provided
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(v =>
                    v.RegistrationNumber.Contains(search) ||
                    v.Make.Contains(search) ||
                    v.Model.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var vehicles = await query
                .OrderBy(v => v.RegistrationNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (vehicles, totalCount);
        }

        public async Task<Vehicle?> GetVehicleByIdAsync(Guid id)
        {
            return await _context.Vehicles.FindAsync(id);
        }

        public async Task<Vehicle?> UpdateVehicleAsync(Guid id, UpdateVehicleDto updateVehicleDto)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return null;

            vehicle.Make = updateVehicleDto.Make;
            vehicle.Model = updateVehicleDto.Model;
            vehicle.Colour = updateVehicleDto.Colour;
            vehicle.Year = (int)updateVehicleDto.Year;
            vehicle.Type = (VehicleType)updateVehicleDto.Type;

            await _context.SaveChangesAsync();
            return vehicle;
        }

        public async Task<bool> DeleteVehicleAsync(Guid id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return false;

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return true;
        }

        // Records operations
        // public async Task<List<InsurancePolicy>> GetActivePoliciesAsync()
        // {
        //     return await _context.InsurancePolicies
        //         .Include(p => p.Vehicle)
        //         .Include(p => p.User)
        //         .Where(p => p.Status == "Active")
        //         .OrderByDescending(p => p.StartDate)
        //         .ToListAsync();
        // }

        // public async Task<List<Payment>> GetPaymentsAsync()
        // {
        //     return await _context.Payments
        //         .Include(p => p.User)
        //         .Include(p => p.InsurancePolicy)
        //             .ThenInclude(ip => ip.Vehicle)
        //         .OrderByDescending(p => p.PaymentDate)
        //         .ToListAsync();
        // }

        // Insurance Rate Operations
        public async Task<List<InsuranceRate>> GetInsuranceRatesAsync()
        {
            return await _context.InsuranceRates
                .OrderBy(r => r.VehicleType)
                .ThenBy(r => r.InsuranceType)
                .ToListAsync();
        }

        public async Task<InsuranceRate?> UpdateInsuranceRateAsync(Guid id, UpdateInsuranceRateDto updateRateDto)
        {
            var rate = await _context.InsuranceRates.FindAsync(id);
            if (rate == null) return null;

            rate.RatePerQuarter = updateRateDto.RatePerQuarter;
            await _context.SaveChangesAsync();
            return rate;
        }

        // User Operations
        public async Task<bool> CreateAdminAsync(CreateAdminDto createAdminDto)
        {
            // Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == createAdminDto.Email);

            if (existingUser != null) return false;

            var formatedFullName = Regex.Replace(createAdminDto.FullName, @"\s+", "_");

            var user = new ApplicationUser { UserName = createAdminDto.Email, Email = createAdminDto.Email, FullName = formatedFullName };
            var result = await _userManager.CreateAsync(user, createAdminDto.Password);
            if (!result.Succeeded) return false;

            // Ensure Client role exists and add
            if (!await _roleManager.RoleExistsAsync("Admin"))
                await _roleManager.CreateAsync(new IdentityRole("Admin"));

            await _userManager.AddToRoleAsync(user, "Admin");

            return true;
        }
    }
}