using Microsoft.AspNetCore.Identity;

public class AdminService : IAdminService
{
    private readonly UserManager<ApplicationUser> _userManager;
    public AdminService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    // {
    //     return _userManager.Users.Select(u => new UserDto(u.Id, u.Email ?? "", u.DisplayName)).ToList();
    // }

    // public async Task<IdentityResult> CreateAdminAsync(CreateAdminDto dto)
    // {
    //     var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email, DisplayName = dto.DisplayName };
    //     var result = await _userManager.CreateAsync(user, dto.Password);
    //     if (!result.Succeeded) return result;

    //     await _userManager.AddToRoleAsync(user, "Admin");
    //     return result;
    // }

    public async Task<IdentityResult> PromoteToAdminAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return IdentityResult.Failed(new IdentityError { Description = "User not found" });
        return await _userManager.AddToRoleAsync(user, "Admin");
    }
}
