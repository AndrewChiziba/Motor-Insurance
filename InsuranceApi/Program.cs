using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using InsuranceApi.Mappings;
using InsuranceApi.Services;
using InsuranceApi.Interfaces;
using InsuranceApi.Data;
using System.Text;
using InsuranceApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Diagnostics;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF Core with PostgreSQL and snake_case naming (modern enum mapping without GlobalTypeMapper)
// Maps InsuranceType enum to PostgreSQL ENUM type)
// Maps VehicleType enum to PostgreSQL ENUM type
builder.Services.AddDbContext<InsuranceDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b
            .MigrationsAssembly("InsuranceApi")
            .MapEnum<VehicleType>()
            .MapEnum<InsuranceType>())
            .UseSnakeCaseNamingConvention());

// Identity with JWT
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<InsuranceDbContext>()
    .AddDefaultTokenProviders();

var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Client", policy => policy.RequireRole("Client"));
});

// DI for services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IInsuranceService, InsuranceService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

// AutoMapper
builder.Services.AddAutoMapper(config => config.AddProfile<MappingProfile>());

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173/")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials()
                  .SetIsOriginAllowed((host) => true) // For debugging, allow all for now
                  .WithExposedHeaders("Authorization");
        });
});

// Debug login

builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
});

var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedData.Initialize(services);
}

app.Run();

// using Microsoft.AspNetCore.Identity;
// using Microsoft.IdentityModel.Tokens;
// using InsuranceApi.Mappings;
// using InsuranceApi.Services;
// using InsuranceApi.Interfaces;
// using InsuranceApi.Data;
// using System.Text;
// using InsuranceApi.Models;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using System.Diagnostics;

// var builder = WebApplication.CreateBuilder(args);

// // Add services to the container.
// builder.Services.AddControllers();

// // Swagger
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// // EF Core with PostgreSQL and snake_case naming
// builder.Services.AddDbContext<InsuranceDbContext>(options =>
//     options.UseNpgsql(
//         builder.Configuration.GetConnectionString("DefaultConnection"),
//         b => b
//             .MigrationsAssembly("InsuranceApi")
//             .MapEnum<VehicleType>()
//             .MapEnum<InsuranceType>())
//             .UseSnakeCaseNamingConvention());

// // Identity with JWT
// builder.Services.AddIdentity<IdentityUser, IdentityRole>()
//     .AddEntityFrameworkStores<InsuranceDbContext>()
//     .AddDefaultTokenProviders();

// var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuerSigningKey = true,
//             IssuerSigningKey = new SymmetricSecurityKey(key),
//             ValidateIssuer = false,
//             ValidateAudience = false
//         };
//     });

// builder.Services.AddAuthorization(options =>
// {
//     options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
//     options.AddPolicy("Client", policy => policy.RequireRole("Client"));
// });

// // DI for services
// builder.Services.AddScoped<IUserService, UserService>();
// builder.Services.AddScoped<IVehicleService, VehicleService>();
// builder.Services.AddScoped<IInsuranceService, InsuranceService>();
// builder.Services.AddScoped<IPaymentService, PaymentService>();

// // AutoMapper
// builder.Services.AddAutoMapper(config => config.AddProfile<MappingProfile>());

// // Add CORS
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend",
//         policy =>
//         {
//             policy.WithOrigins("http://localhost:5173/")
//                   .AllowAnyMethod()
//                   .AllowAnyHeader()
//                   .AllowCredentials();
//         });
// });

// // Logging
// builder.Services.AddLogging(logging =>
// {
//     logging.AddConsole();
// });

// var app = builder.Build();

// // Custom middleware to handle OPTIONS preflight requests
// app.Use(async (context, next) =>
// {
//     if (context.Request.Method == "OPTIONS")
//     {
//         context.Response.StatusCode = (int)HttpStatusCode.OK;
//         context.Response.Headers.Append("Access-Control-Allow-Origin", "http://localhost:5173/");
//         context.Response.Headers.Append("Access-Control-Allow-Methods", "POST, OPTIONS");
//         context.Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type, Authorization");
//         context.Response.Headers.Append("Access-Control-Allow-Credentials", "true");
//         return;
//     }
//     await next();
// });

// // Configure the HTTP request pipeline
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseCors("AllowFrontend"); // Must be before authentication
// app.UseAuthentication();
// app.UseAuthorization();

// app.MapControllers();

// // Seed data
// using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;
//     await SeedData.Initialize(services);
// }

// app.Run();