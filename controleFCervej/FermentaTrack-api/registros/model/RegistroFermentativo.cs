namespace ControleFCervej.RESTAPI.registros.model;

public static class StatusFermentacao
{
    public const string DentroPadrao = "dentro_padrao";
    public const string Atencao = "atencao";
    public const string ForaPadrao = "fora_padrao";
}

public sealed record RegistroFermentativo(
    Guid Id,
    Guid CervejaId,
    Guid TanqueId,
    string NumeroLote,
    DateTime DataHora,
    decimal Temperatura,
    decimal Ph,
    decimal Extrato,
    string? Observacoes,
    string Status,
    DateTime CriadoEm
);
