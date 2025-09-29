using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using InsuranceApi.Models;

namespace InsuranceApi.Data;

public class InsuranceDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<InsurancePolicy> InsurancePolicies { get; set; }
    public DbSet<Quotation> Quotations { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<InsuranceRate> InsuranceRates { get; set; }

    public InsuranceDbContext(DbContextOptions<InsuranceDbContext> options) : base(options) { }
    protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);

    builder.HasPostgresEnum<VehicleType>();
    builder.HasPostgresEnum<InsuranceType>();

    // Ensure vehicle registration numbers are unique
    builder.Entity<Vehicle>()
        .HasIndex(v => v.RegistrationNumber)
        .IsUnique();

    // Vehicle relationship (unidirectional from InsurancePolicy to Vehicle)
    builder.Entity<InsurancePolicy>()
        .HasOne<Vehicle>() 
        .WithMany()        
        .HasForeignKey(p => p.VehicleId);

    // Quotation relationship
    builder.Entity<Quotation>()
        .HasOne<Vehicle>()
        .WithMany()
        .HasForeignKey(q => q.VehicleId);

    // Payment relationship
    builder.Entity<Payment>()
        .HasOne<InsurancePolicy>()
        .WithMany()
        .HasForeignKey(p => p.InsurancePolicyId);
}


    //  protected override void OnModelCreating(ModelBuilder builder)
    // {
    //     base.OnModelCreating(builder);

    //     builder.HasPostgresEnum<VehicleType>();
    //     builder.HasPostgresEnum<InsuranceType>();


    //     // Vehicle relationship (unidirectional from InsurancePolicy to Vehicle)
    //     builder.Entity<InsurancePolicy>()
        
    //         .HasOne<Vehicle>() // No navigation property needed
    //         .WithMany()        // Vehicle can have many policies
    //         .HasForeignKey(p => p.VehicleId);

    //     // Quotation relationship (unidirectional from Quotation to Vehicle)
    //     builder.Entity<Quotation>()
    //         .HasOne<Vehicle>()
    //         .WithMany()
    //         .HasForeignKey(q => q.VehicleId);

    //     // Payment relationship (unidirectional from Payment to InsurancePolicy)
    //     builder.Entity<Payment>()
    //         .HasOne<InsurancePolicy>()
    //         .WithMany() // No reverse navigation
    //         .HasForeignKey(p => p.PolicyId);
    // }
}