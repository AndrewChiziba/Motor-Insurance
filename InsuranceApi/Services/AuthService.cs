using InsuranceApi.DTOs;
using InsuranceApi.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _config;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration config)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _config = config;
    }

    public async Task<IdentityResult> RegisterClientAsync(RegisterDto dto)
    {
        //  var userExists = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        //     if (userExists != null)
        //         return new { Message = "Emailr already registered!" };
        var formatedFullName = Regex.Replace(dto.FullName, @"\s+", "_");

        var user = new ApplicationUser
        {
            UserName = formatedFullName,
            Email = dto.Email,
            FullName = formatedFullName
        };
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return result;

        // Ensure Client role exists and add
        if (!await _roleManager.RoleExistsAsync("Client"))
            await _roleManager.CreateAsync(new IdentityRole("Client"));

        await _userManager.AddToRoleAsync(user, "Client");
        return result;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return null;
        if (!await _userManager.CheckPasswordAsync(user, dto.Password)) return null;

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Client";
        var fullName = user.FullName.Replace("_", " ");

        var token = GenerateJwtToken(user, role);
        var expires = DateTime.UtcNow.AddMinutes(_config.GetValue<int>("Jwt:ExpiryMinutes"));
        return new AuthResponseDto(token, expires.ToString("o"), role, user.Email ?? "", fullName);
    }

    private string GenerateJwtToken(ApplicationUser user, string role)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? ""),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiry = DateTime.UtcNow.AddMinutes(_config.GetValue<int>("Jwt:ExpiryMinutes"));

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiry,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // Seeder helper: ensure roles exist and create initial admin user if not present
    public async Task EnsureRolesAndAdminAsync()
    {
        // Ensure roles
        var roles = new[] { "Admin", "Client" };
        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Switch to .env config before production
        var adminEmail = _config["AdminUser:Email"] ?? "admin@mail";
        var adminPassword = _config["AdminUser:Password"] ?? "Password1234!";

        // Ensure admin user
        var adminUser = await _userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = "Admin",
                Email = adminEmail,
                FullName = "Admin",
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(adminUser, "Admin");
            }
            else
            {
                throw new Exception($"Failed to create admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
    }

}
