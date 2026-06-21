namespace ControleFCervej.RESTAPI.tanques.model;

public sealed record Tanque(
    Guid Id,
    string Nome,
    decimal Capacidade,
    DateTime CriadoEm
);
