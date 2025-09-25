using Microsoft.AspNetCore.Identity;
using InsuranceApi.DTOs;

namespace InsuranceApi.Interfaces;

public interface IUserService
{
    Task<IdentityResult> RegisterAsync(RegisterDto registerDto); // Register a new user
    Task<string> LoginAsync(LoginDto loginDto); // Generate JWT token
}