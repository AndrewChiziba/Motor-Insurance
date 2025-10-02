// using InsuranceApi.DTOs;
// using InsuranceApi.Interfaces;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.Extensions.Configuration.UserSecrets;
// using Microsoft.IdentityModel.Tokens;
// using System.IdentityModel.Tokens.Jwt;
// using System.Security.Claims;
// using System.Text;
// using System.Text.RegularExpressions;

// public class AuthService : IAuthService
// {
//     private readonly UserManager<ApplicationUser> _userManager;
//     private readonly RoleManager<IdentityRole> _roleManager;
//     private readonly IConfiguration _config;

//     public AuthService(
//         UserManager<ApplicationUser> userManager,
//         RoleManager<IdentityRole> roleManager,
//         IConfiguration config)
//     {
//         _userManager = userManager;
//         _roleManager = roleManager;
//         _config = config;
//     }

//     public async Task<IdentityResult> RegisterClientAsync(RegisterDto dto)
//     {
//         //  var userExists = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
//         //     if (userExists != null)
//         //         return new { Message = "Emailr already registered!" };
//         var formatedFullName = Regex.Replace(dto.FullName, @"\s+", "_");

//         var user = new ApplicationUser
//         {
//             UserName = dto.Email,
//             Email = dto.Email,
//             FullName = formatedFullName
//         };
//         var result = await _userManager.CreateAsync(user, dto.Password);
//         if (!result.Succeeded) return result;

//         // Ensure Client role exists and add
//         if (!await _roleManager.RoleExistsAsync("Client"))
//             await _roleManager.CreateAsync(new IdentityRole("Client"));

//         await _userManager.AddToRoleAsync(user, "Client");
//         return result;
//     }

//     public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
//     {
//         var user = await _userManager.FindByEmailAsync(dto.Email);
//         if (user == null) return null;
//         if (!await _userManager.CheckPasswordAsync(user, dto.Password)) return null;


//         // Console.WriteLine("user: " + user.Id.ToString());

//         var roles = await _userManager.GetRolesAsync(user);
//         var role = roles.FirstOrDefault() ?? "Client";
//         var fullName = user.FullName.Replace("_", " ");

//         var token = GenerateJwtToken(user, role);
//         var expires = DateTime.UtcNow.AddMinutes(_config.GetValue<int>("Jwt:ExpiryMinutes"));
//         return new AuthResponseDto(token, expires.ToString("o"), role, user.Email ?? "", fullName);
//     }

//     private string GenerateJwtToken(ApplicationUser user, string role)
//     {
//         var claims = new List<Claim>
//         {
//             new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? ""),
//             // new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), //get overwritten with username
//             new Claim("UserId", user.Id.ToString()),
//             new Claim(ClaimTypes.Email, user.Email ?? ""),
//             new Claim(ClaimTypes.Role, role),
//             new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
//         };

//         var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
//         var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//         var expiry = DateTime.UtcNow.AddMinutes(_config.GetValue<int>("Jwt:ExpiryMinutes"));

//         var token = new JwtSecurityToken(
//             issuer: _config["Jwt:Issuer"],
//             audience: _config["Jwt:Audience"],
//             claims: claims,
//             expires: expiry,
//             signingCredentials: creds
//         );

//         return new JwtSecurityTokenHandler().WriteToken(token);
//     }

//     // Seeder helper: ensure roles exist and create initial admin user if not present
//     public async Task EnsureRolesAndAdminAsync()
//     {
//         // Ensure roles
//         var roles = new[] { "Admin", "Client" };
//         foreach (var role in roles)
//         {
//             if (!await _roleManager.RoleExistsAsync(role))
//             {
//                 await _roleManager.CreateAsync(new IdentityRole(role));
//             }
//         }

//         // Switch to .env config before production
//         var adminEmail = _config["AdminUser:Email"] ?? "admin@mail";
//         var adminPassword = _config["AdminUser:Password"] ?? "Password1234!";

//         // Ensure admin user
//         var adminUser = await _userManager.FindByEmailAsync(adminEmail);
//         if (adminUser == null)
//         {
//             adminUser = new ApplicationUser
//             {
//                 UserName = "Admin",
//                 Email = adminEmail,
//                 FullName = "Admin",
//                 EmailConfirmed = true
//             };

//             var result = await _userManager.CreateAsync(adminUser, adminPassword);
//             if (result.Succeeded)
//             {
//                 await _userManager.AddToRoleAsync(adminUser, "Admin");
//             }
//             else
//             {
//                 throw new Exception($"Failed to create admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");
//             }
//         }
//     }

// }
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
        var formatedFullName = Regex.Replace(dto.FullName, @"\s+", "_");

        var user = new ApplicationUser
        {
            UserName = dto.Email,
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
        var expires = DateTime.UtcNow.AddMinutes(GetJwtExpiryMinutes());
        return new AuthResponseDto(token, expires.ToString("o"), role, user.Email ?? "", fullName);
    }

    private string GenerateJwtToken(ApplicationUser user, string role)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? ""),
            new Claim("UserId", user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(GetJwtKey()));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiry = DateTime.UtcNow.AddMinutes(GetJwtExpiryMinutes());

        var token = new JwtSecurityToken(
            issuer: GetJwtIssuer(),
            audience: GetJwtAudience(),
            claims: claims,
            expires: expiry,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // Helper methods to get JWT settings with fallbacks
    private string GetJwtKey() =>
        _config["JWT_KEY"] ?? _config["Jwt:Key"] ?? throw new Exception("JWT Key is required");

    private string GetJwtIssuer() =>
        _config["JWT_ISSUER"] ?? _config["Jwt:Issuer"] ?? "MotorInsuranceAPI";

    private string GetJwtAudience() =>
        _config["JWT_AUDIENCE"] ?? _config["Jwt:Audience"] ?? "MotorInsuranceClients";

    private int GetJwtExpiryMinutes()
    {
        // Try environment variable first
        if (int.TryParse(_config["JWT_EXPIRY_MINUTES"], out int envExpiry))
        {
            return envExpiry;
        }

        // Fall back to appsettings
        return _config.GetValue<int>("Jwt:ExpiryMinutes", 120);
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

        // Get admin credentials from environment variables with fallbacks
        var adminEmail = _config["ADMIN_EMAIL"] ??
                        _config["AdminUser:Email"] ??
                        throw new Exception("ADMIN_EMAIL environment variable is required");

        var adminPassword = _config["ADMIN_PASSWORD"] ??
                           _config["AdminUser:Password"] ??
                           throw new Exception("ADMIN_PASSWORD environment variable is required");

        // Ensure admin user
        var adminUser = await _userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail, // Use email as username for consistency
                Email = adminEmail,
                FullName = "System Administrator",
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(adminUser, "Admin");
                Console.WriteLine($"Admin user created: {adminEmail}");
            }
            else
            {
                // Log 
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                Console.WriteLine($"Warning: Failed to create admin user: {errors}");
            }
        }
    }
}