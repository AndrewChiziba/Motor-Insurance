using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
// [Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _userService;
    public AdminController(IAdminService adminService)
    {
        _userService = adminService;
    }

    // [HttpGet("users")]
    // public async Task<IActionResult> GetUsers() => Ok(await _userService.GetAllUsersAsync());

    // [HttpPost("create-admin")]
    // public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
    // {
    //     var res = await _userService.CreateAdminAsync(dto);
    //     if (!res.Succeeded) return BadRequest(res.Errors);
    //     return Ok();
    // }
}
