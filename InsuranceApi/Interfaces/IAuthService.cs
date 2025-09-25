using Microsoft.AspNetCore.Identity;
using InsuranceApi.DTOs;

namespace InsuranceApi.Interfaces;

public interface IAuthService
{
    Task<IdentityResult> RegisterClientAsync(RegisterDto registerDto); // Register a new user
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task EnsureRolesAndAdminAsync(); // seeder helper
}