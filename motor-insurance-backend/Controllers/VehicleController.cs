using Microsoft.AspNetCore.Mvc;
using InsuranceApi.DTOs;
using InsuranceApi.Interfaces;
using System.Security.Claims;

namespace InsuranceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehiclesController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        // Get all vehicles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleDto>>> GetAll()
        {
            var vehicles = await _vehicleService.GetAllAsync();
            return Ok(vehicles);
        }

        // Get vehicle by ID
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<VehicleDto>> GetById(Guid id)
        {
            var vehicle = await _vehicleService.GetByIdAsync(id);
            if (vehicle == null) return NotFound();
            return Ok(vehicle);
        }

        // Search vehicle by registration number
        [HttpGet("search/{registrationNumber}")]
        public async Task<ActionResult<VehicleDto>> Search(string registrationNumber)
        {
            var vehicle = await _vehicleService.GetByRegistrationNumberAsync(registrationNumber);
            if (vehicle == null) return NotFound();
            return Ok(vehicle);
        }

        // Add new vehicle
        [HttpPost]
        public async Task<ActionResult<VehicleDto>> Add([FromBody] CreateVehicleDto createDto)
        {
            var vehicle = await _vehicleService.AddAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
        }

        // Update vehicle
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<VehicleDto>> Update(Guid id, [FromBody] UpdateVehicleDto updateDto)
        {
            var updatedVehicle = await _vehicleService.UpdateAsync(id, updateDto);
            if (updatedVehicle == null) return NotFound();
            return Ok(updatedVehicle);
        }

        // Delete vehicle
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _vehicleService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
