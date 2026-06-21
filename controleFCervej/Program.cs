using ControleFCervej.RESTAPI.cervejas.repository;
using ControleFCervej.RESTAPI.cervejas.service;
using ControleFCervej.RESTAPI.dashboard.service;
using ControleFCervej.RESTAPI.lotes.service;
using ControleFCervej.RESTAPI.parametros.repository;
using ControleFCervej.RESTAPI.parametros.service;
using ControleFCervej.RESTAPI.registros.repository;
using ControleFCervej.RESTAPI.registros.service;
using ControleFCervej.RESTAPI.shared.database;
using ControleFCervej.RESTAPI.tanques.repository;
using ControleFCervej.RESTAPI.tanques.service;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=1216";

builder.Services.AddControllers();
builder.Services.AddSingleton(new DatabaseConnectionFactory(connectionString));
builder.Services.AddSingleton<DatabaseInitializer>();
builder.Services.AddSingleton<CervejaRepository>();
builder.Services.AddSingleton<CervejaService>();
builder.Services.AddSingleton<TanqueRepository>();
builder.Services.AddSingleton<TanqueService>();
builder.Services.AddSingleton<ParametrosRepository>();
builder.Services.AddSingleton<ParametrosService>();
builder.Services.AddSingleton<RegistroRepository>();
builder.Services.AddSingleton<RegistroService>();
builder.Services.AddSingleton<LoteService>();
builder.Services.AddSingleton<DashboardService>();

var app = builder.Build();

app.Services.GetRequiredService<DatabaseInitializer>().Initialize();

app.MapGet("/", () => Results.Ok(new
{
    aplicacao = "FermentaTrack API",
    status = "online",
    banco = "postgresql"
}));

app.MapControllers();

app.Run();
