namespace ControleFCervej.RESTAPI.registros.model;

public sealed record CriarRegistroRequest(
    Guid? CervejaId,
    Guid? TanqueId,
    string? NumeroLote,
    DateTime? DataHora,
    decimal? Temperatura,
    decimal? Ph,
    decimal? Extrato,
    string? Observacoes
);

public sealed record AtualizarRegistroRequest(
    Guid? CervejaId,
    Guid? TanqueId,
    string? NumeroLote,
    DateTime? DataHora,
    decimal? Temperatura,
    decimal? Ph,
    decimal? Extrato,
    string? Observacoes
);
