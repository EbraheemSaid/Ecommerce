using API.Middleware;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

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
