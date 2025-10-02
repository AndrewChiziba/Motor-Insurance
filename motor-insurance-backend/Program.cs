// using Microsoft.AspNetCore.Identity;
// using Microsoft.IdentityModel.Tokens;
// using InsuranceApi.Mappings;
// using InsuranceApi.Services;
// using InsuranceApi.Interfaces;
// using InsuranceApi.Data;
// using System.Text;
// using InsuranceApi.Models;
// using Microsoft.EntityFrameworkCore;



// var builder = WebApplication.CreateBuilder(args);

// // Add services to the container.
// builder.Services.AddControllers();

// // Swagger
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// // EF Core with PostgreSQL and snake_case naming
// // Map InsuranceType enum to PostgreSQL ENUM type)
// // Map VehicleType enum to PostgreSQL ENUM type
// builder.Services.AddDbContext<InsuranceDbContext>(options =>
//     options.UseNpgsql(
//         builder.Configuration.GetConnectionString("DefaultConnection"),
//         b => b
//             .MigrationsAssembly("InsuranceApi")
//             .MapEnum<VehicleType>()
//             .MapEnum<InsuranceType>())
//             .UseSnakeCaseNamingConvention());

// // Identity with JWT
// builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
// {
//     options.User.RequireUniqueEmail = true;
// })
// .AddEntityFrameworkStores<InsuranceDbContext>()
// .AddDefaultTokenProviders();

// // JWT authentication
// var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new Exception("Jwt key missing");
// var jwtIssuer = builder.Configuration["Jwt:Issuer"];
// var jwtAudience = builder.Configuration["Jwt:Audience"];

// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = "JwtBearer";
//     options.DefaultChallengeScheme = "JwtBearer";
// })
// .AddJwtBearer("JwtBearer", opts =>
// {
//     opts.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuer = true,
//         ValidateAudience = true,
//         ValidateLifetime = true,
//         ValidateIssuerSigningKey = true,
//         ValidIssuer = jwtIssuer,
//         ValidAudience = jwtAudience,
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
//     };
// });

// builder.Services.AddAuthorization(options =>
// {
//     options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
//     options.AddPolicy("Client", policy => policy.RequireRole("Client"));
// });

// // Add CORS
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend",
//         policy =>
//         {
//             policy.WithOrigins("http://localhost:5173")
//                   .AllowAnyMethod()
//                   .AllowAnyHeader()
//                   .AllowCredentials();
//             //   .SetIsOriginAllowed((host) => true) // For debugging, allow all requests
//             //   .WithExposedHeaders("Authorization");
//         });
// });

// // DI for services
// builder.Services.AddScoped<IAuthService, AuthService>();
// builder.Services.AddScoped<IAdminService, AdminService>();
// builder.Services.AddScoped<IVehicleService, VehicleService>();
// builder.Services.AddScoped<IInsuranceService, InsuranceService>();
// builder.Services.AddScoped<IPaymentService, PaymentService>();

// builder.Services.AddScoped<IAdminService, AdminService>();

// // AutoMapper
// builder.Services.AddAutoMapper(config => config.AddProfile<MappingProfile>());


// var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;

//     var db = services.GetRequiredService<InsuranceDbContext>();
//     db.Database.Migrate();

//     // Seed roles & admin
//     var authService = services.GetRequiredService<IAuthService>();
//     await authService.EnsureRolesAndAdminAsync();

//     // Seed domain data (insurance rates, vehicles, etc.)
//     await SeedData.Initialize(services);
// }

// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseCors("AllowFrontend");
// app.UseHttpsRedirection();
// app.UseAuthentication();
// app.UseAuthorization();

// app.MapControllers();

// app.Run();
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using InsuranceApi.Mappings;
using InsuranceApi.Services;
using InsuranceApi.Interfaces;
using InsuranceApi.Data;
using System.Text;
using InsuranceApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to use alternative port
// builder.WebHost.ConfigureKestrel(serverOptions =>
// {
//     serverOptions.ListenAnyIP(8081); // Use alternative port
// });

// Load environment-specific configuration
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables(); // This loads .env files via system environment variables

// Add services to the container.
builder.Services.AddControllers();

// Swagger - only in development
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

// EF Core with PostgreSQL
builder.Services.AddDbContext<InsuranceDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection") ??
        throw new Exception("Database connection string is required"),
        b => b
            .MigrationsAssembly("InsuranceApi")
            .MapEnum<VehicleType>()
            .MapEnum<InsuranceType>())
            .UseSnakeCaseNamingConvention());

// Identity with JWT
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<InsuranceDbContext>()
.AddDefaultTokenProviders();

// JWT authentication - get from environment variables
var jwtKey = builder.Configuration["JWT_KEY"] ??
              builder.Configuration["Jwt:Key"] ??
              throw new Exception("JWT_KEY environment variable is required");

var jwtIssuer = builder.Configuration["JWT_ISSUER"] ?? builder.Configuration["Jwt:Issuer"] ?? "MotorInsuranceAPI";
var jwtAudience = builder.Configuration["JWT_AUDIENCE"] ?? builder.Configuration["Jwt:Audience"] ?? "MotorInsuranceClients";

var jwtExpiryMinutes = builder.Configuration.GetValue<int>("JWT_EXPIRY_MINUTES",
                      builder.Configuration.GetValue<int>("Jwt:ExpiryMinutes", 120));


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "JwtBearer";
    options.DefaultChallengeScheme = "JwtBearer";
})
.AddJwtBearer("JwtBearer", opts =>
{
    opts.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Client", policy => policy.RequireRole("Client"));
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",  // Vite default
                    "http://localhost:3001",  // Docker frontend (alternative)
                    "http://react-frontend:3000"  // Docker container
                  )
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
});

// DI for services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IInsuranceService, InsuranceService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

// AutoMapper
builder.Services.AddAutoMapper(config => config.AddProfile<MappingProfile>());

var app = builder.Build();

// Database migration and seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var db = services.GetRequiredService<InsuranceDbContext>();
    db.Database.Migrate();

    // Seed roles & admin
    var authService = services.GetRequiredService<IAuthService>();
    await authService.EnsureRolesAndAdminAsync();

    // Seed domain data (insurance rates, vehicles, etc.)
    await SeedData.Initialize(services);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// Add health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "Healthy", timestamp = DateTime.UtcNow }));

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();