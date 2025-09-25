using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InsuranceApi.DTOs;
using InsuranceApi.Interfaces;

namespace InsuranceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var res = await _authService.RegisterClientAsync(dto);
        if (!res.Succeeded) return BadRequest(res.Errors);
        return Created("", new { Message = "Account Successfully Created" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var token = await _authService.LoginAsync(dto);
        if (token == null) return Unauthorized();
        return Ok(token);
    }
}