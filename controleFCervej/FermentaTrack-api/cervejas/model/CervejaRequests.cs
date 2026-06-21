namespace ControleFCervej.RESTAPI.cervejas.model;

public sealed record CriarCervejaRequest(string? Nome, string? Estilo);

public sealed record AtualizarCervejaRequest(string? Nome, string? Estilo);
