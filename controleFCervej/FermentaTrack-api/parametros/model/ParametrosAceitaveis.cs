namespace ControleFCervej.RESTAPI.parametros.model;

public sealed record ParametrosAceitaveis(
    Guid Id,
    Guid CervejaId,
    decimal TempMin,
    decimal TempMax,
    decimal PhMin,
    decimal PhMax,
    decimal ExtratoMin,
    decimal ExtratoMax,
    DateTime CriadoEm,
    DateTime AtualizadoEm
);
