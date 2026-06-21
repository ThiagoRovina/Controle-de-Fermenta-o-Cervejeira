namespace ControleFCervej.RESTAPI.parametros.model;

public sealed record AtualizarParametrosRequest(
    decimal? TempMin,
    decimal? TempMax,
    decimal? PhMin,
    decimal? PhMax,
    decimal? ExtratoMin,
    decimal? ExtratoMax
);
