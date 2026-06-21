using ControleFCervej.RESTAPI.registros.model;

namespace ControleFCervej.RESTAPI.lotes.model;

public sealed record LoteResumo(
    string NumeroLote,
    int TotalRegistros,
    DateTime PrimeiraMedicao,
    DateTime UltimaMedicao,
    string UltimoStatus
);

public sealed record LoteHistorico(
    string NumeroLote,
    IReadOnlyCollection<RegistroFermentativo> Registros
);
