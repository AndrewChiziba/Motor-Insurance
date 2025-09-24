using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InsuranceApi.DTOs;
using InsuranceApi.Models;
using InsuranceApi.Data;

namespace InsuranceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize(Policy = "Admin")] // Only admins can access
public class AdminController : ControllerBase
{
    private readonly InsuranceDbContext _context;

    public AdminController(InsuranceDbContext context)
    {
        _context = context;
    }

    // Get all insurance policies (admin only)
    [HttpGet("policies")]
    public async Task<ActionResult<IEnumerable<InsurancePolicyDto>>> GetAllPolicies()
    {
        var policies = await _context.InsurancePolicies.ToListAsync();
        var dtos = policies.Select(p => new InsurancePolicyDto
        {
            Id = p.Id,
            VehicleId = p.VehicleId,
            UserId = p.UserId,
            Type = p.Type,
            StartDate = p.StartDate,
            DurationQuarters = p.DurationQuarters,
            Amount = p.Amount,
            Status = p.Status
        });
        return Ok(dtos);
    }

    // Get all vehicles (admin only)
    [HttpGet("vehicles")]
    public async Task<ActionResult<IEnumerable<VehicleDto>>> GetAllVehicles()
    {
        var vehicles = await _context.Vehicles.ToListAsync();
        var dtos = vehicles.Select(v => new VehicleDto
        {
            Id = v.Id,
            RegistrationNumber = v.RegistrationNumber,
            Make = v.Make,
            Model = v.Model,
            Year = v.Year,
            Type = v.Type
        });
        return Ok(dtos);
    }
}