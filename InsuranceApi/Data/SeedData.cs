using Microsoft.AspNetCore.Identity;
using InsuranceApi.Models;
using InsuranceApi.Data;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = serviceProvider.GetRequiredService<InsuranceDbContext>();
        // var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        // var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // // Seed roles
        // if (!await roleManager.RoleExistsAsync("Admin"))
        //     await roleManager.CreateAsync(new IdentityRole("Admin"));
        // if (!await roleManager.RoleExistsAsync("Client"))
        //     await roleManager.CreateAsync(new IdentityRole("Client"));

        // // Seed admin user
        // var adminEmail = "admin@mail";
        // if (await userManager.FindByEmailAsync(adminEmail) == null)
        // {
        //     var admin = new ApplicationUser { UserName = adminEmail, Email = adminEmail, DisplayName = "Admin" };
        //     var result = await userManager.CreateAsync(admin, "AdminPassword123!");
        //     if (result.Succeeded)
        //         await userManager.AddToRoleAsync(admin, "Admin");
        // }

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

        // Seed 5 sample vehicles
        if (!context.Vehicles.Any())
        {
            var vehicles = new List<Vehicle>
            {
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "ABC123", Make = "Toyota", Model = "Camry", Year = 2020, Type = VehicleType.Private },
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "XYZ789", Make = "Honda", Model = "Fit", Year = 2019, Type = VehicleType.Private },
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "DEF456", Make = "Volvo", Model = "FH150", Year = 2021, Type = VehicleType.Commercial },
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "GHI789", Make = "Nissan", Model = "Tiida", Year = 2018, Type = VehicleType.Private },
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "JKL012", Make = "Mitsubishi", Model = "Fuso", Year = 2022, Type = VehicleType.Commercial }
            };
            context.Vehicles.AddRange(vehicles);
            await context.SaveChangesAsync();
        }
    }
}