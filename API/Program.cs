using API.Middleware;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddCors();

builder.Services.AddSingleton<IConnectionMultiplexer>(config =>
{
    var connString = builder.Configuration.GetConnectionString("Redis") ?? throw new InvalidOperationException("Redis connection string is not configured.");
    var configuration = ConfigurationOptions.Parse(connString, true);
    return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddSingleton<ICartService, CartService>();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>().AddEntityFrameworkStores<StoreContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(x => x.AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("https://localhost:4200", "https://localhost:4200")); // Adjust the origin as needed
app.MapControllers();
app.MapGroup("api").MapIdentityApi<AppUser>();

// Seed the database

try
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<Infrastructure.Data.StoreContext>();
    await context.Database.MigrateAsync();
    await Infrastructure.Data.StoreContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    Console.WriteLine($"An error occurred while seeding the database: {ex.Message}");
}


app.Run();
