namespace ControleFCervej.RESTAPI.tanques.model;

public sealed record CriarTanqueRequest(string? Nome, decimal? Capacidade);

public sealed record AtualizarTanqueRequest(string? Nome, decimal? Capacidade);
