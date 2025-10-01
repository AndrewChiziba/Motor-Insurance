using InsuranceApi.DTOs;
using InsuranceApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceApi.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // Vehicle Operations

        [HttpGet("vehicles")]
        public async Task<IActionResult> GetVehicles([FromQuery] string? search, [FromQuery] int page = 1)
        {
            try
            {
                var (vehicles, totalCount) = await _adminService.GetVehiclesAsync(search, page);
                return Ok(new { vehicles, totalCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving vehicles." });
            }
        }

        [HttpGet("vehicles/{id}")]
        public async Task<IActionResult> GetVehicle(Guid id)
        {
            try
            {
                var vehicle = await _adminService.GetVehicleByIdAsync(id);
                if (vehicle == null)
                    return NotFound(new { message = "Vehicle not found." });

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the vehicle." });
            }
        }

        [HttpPut("vehicles/{id}")]
        public async Task<IActionResult> UpdateVehicle(Guid id, [FromBody] UpdateVehicleDto dto)
        {
            try
            {
                var updatedVehicle = await _adminService.UpdateVehicleAsync(id, dto);
                if (updatedVehicle == null)
                    return NotFound(new { message = "Vehicle not found." });

                return Ok(updatedVehicle);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the vehicle." });
            }
        }

        [HttpDelete("vehicles/{id}")]
        public async Task<IActionResult> DeleteVehicle(Guid id)
        {
            try
            {
                var result = await _adminService.DeleteVehicleAsync(id);
                if (!result)
                    return NotFound(new { message = "Vehicle not found." });

                return Ok(new { message = "Vehicle deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the vehicle." });
            }
        }

        // Insurance Rate Operations

        [HttpGet("insurance-rates")]
        public async Task<IActionResult> GetInsuranceRates()
        {
            try
            {
                var rates = await _adminService.GetInsuranceRatesAsync();
                return Ok(rates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving insurance rates." });
            }
        }

        [HttpPut("insurance-rates/{id}")]
        public async Task<IActionResult> UpdateInsuranceRate(Guid id, [FromBody] UpdateInsuranceRateDto dto)
        {
            try
            {
                var updatedRate = await _adminService.UpdateInsuranceRateAsync(id, dto);
                if (updatedRate == null)
                    return NotFound(new { message = "Insurance rate not found." });

                return Ok(updatedRate);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the insurance rate." });
            }
        }

        // User Operations

        [HttpPost("users")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
        {
            try
            {
                var result = await _adminService.CreateAdminAsync(dto);
                if (!result)
                    return BadRequest(new { message = "Failed to create admin user. User may already exist." });

                return Ok(new { message = "Admin user created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the admin user." });
            }
        }
    }
}