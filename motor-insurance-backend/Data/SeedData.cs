using Microsoft.AspNetCore.Identity;
using InsuranceApi.Models;
using InsuranceApi.Data;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = serviceProvider.GetRequiredService<InsuranceDbContext>();
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
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "ABC123", Make = "Toyota", Model = "Camry", Colour = "White", Year = 2020, Type = VehicleType.Private },
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "BBA1212", Make = "Honda", Model = "Fit", Colour = "Red", Year = 2011, Type = VehicleType.Private },
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "DEF456", Make = "Volvo", Model = "FH150", Colour = "White", Year = 2021, Type = VehicleType.Commercial },
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "GHI789", Make = "Nissan", Model = "Tiida", Colour = "Black", Year = 2018, Type = VehicleType.Private },
                new Vehicle { Id = Guid.NewGuid(), RegistrationNumber = "JKL1512", Make = "Mitsubishi", Model = "Fuso", Colour = "Gray", Year = 2002, Type = VehicleType.Commercial }
            };
            context.Vehicles.AddRange(vehicles);
            await context.SaveChangesAsync();
        }
    }
}