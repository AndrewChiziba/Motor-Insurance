using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InsuranceApi.DTOs;
using InsuranceApi.Interfaces;

namespace InsuranceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize(Policy = "Client")] // Only clients can access
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    // Search vehicle by registration number
    [HttpGet("search/{registrationNumber}")]
    public async Task<ActionResult<VehicleDto>> Search(string registrationNumber)
    {
        var vehicle = await _vehicleService.GetByRegistrationNumberAsync(registrationNumber);
        if (vehicle == null)
            return NotFound();
        return Ok(vehicle);
    }

    // Add new vehicle
    [HttpPost]
    public async Task<ActionResult<VehicleDto>> Add([FromBody] CreateVehicleDto createDto)
    {
        var vehicle = await _vehicleService.AddAsync(createDto);
        return CreatedAtAction(nameof(Search), new { registrationNumber = vehicle.RegistrationNumber }, vehicle);
    }
}