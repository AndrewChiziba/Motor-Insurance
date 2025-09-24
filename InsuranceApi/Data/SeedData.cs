using Microsoft.AspNetCore.Identity;
using InsuranceApi.Models;
using InsuranceApi.Data;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = serviceProvider.GetRequiredService<InsuranceDbContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Seed roles
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        if (!await roleManager.RoleExistsAsync("Client"))
            await roleManager.CreateAsync(new IdentityRole("Client"));

        // Seed admin user
        var adminEmail = "admin@example.com";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var admin = new IdentityUser { UserName = adminEmail, Email = adminEmail };
            var result = await userManager.CreateAsync(admin, "AdminPassword123!");
            if (result.Succeeded)
                await userManager.AddToRoleAsync(admin, "Admin");
        }

        // Seed insurance rates
        if (!context.InsuranceRates.Any())
        {
            context.InsuranceRates.AddRange(
                new InsuranceRate { Id = Guid.NewGuid(), VehicleType = VehicleType.Private, InsuranceType = InsuranceType.Comprehensive, RatePerQuarter = 500m },
                new InsuranceRate { Id = Guid.NewGuid(), VehicleType = VehicleType.Private, InsuranceType = InsuranceType.ThirdParty, RatePerQuarter = 300m },
                new InsuranceRate { Id = Guid.NewGuid(), VehicleType = VehicleType.Commercial, InsuranceType = InsuranceType.Comprehensive, RatePerQuarter = 800m },
                new InsuranceRate { Id = Guid.NewGuid(), VehicleType = VehicleType.Commercial, InsuranceType = InsuranceType.ThirdParty, RatePerQuarter = 500m }
            );
            await context.SaveChangesAsync();
        }
    }
}