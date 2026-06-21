namespace ControleFCervej.RESTAPI.cervejas.model;

public sealed record Cerveja(
    Guid Id,
    string Nome,
    string Estilo,
    DateTime CriadoEm
);
