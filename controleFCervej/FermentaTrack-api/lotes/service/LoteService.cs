using ControleFCervej.RESTAPI.lotes.model;
using ControleFCervej.RESTAPI.registros.repository;

namespace ControleFCervej.RESTAPI.lotes.service;

public sealed class LoteService
{
    private readonly RegistroRepository _registroRepository;

    public LoteService(RegistroRepository registroRepository)
    {
        _registroRepository = registroRepository;
    }

    public IReadOnlyCollection<LoteResumo> Listar()
    {
        return _registroRepository.Listar()
            .GroupBy(registro => registro.NumeroLote, StringComparer.OrdinalIgnoreCase)
            .Select(grupo =>
            {
                var registros = grupo
                    .OrderBy(registro => registro.DataHora)
                    .ThenBy(registro => registro.CriadoEm)
                    .ToArray();

                var ultimo = registros[^1];

                return new LoteResumo(
                    grupo.Key,
                    registros.Length,
                    registros[0].DataHora,
                    ultimo.DataHora,
                    ultimo.Status
                );
            })
            .OrderByDescending(lote => lote.UltimaMedicao)
            .ThenBy(lote => lote.NumeroLote)
            .ToArray();
    }

    public LoteHistorico? ObterHistorico(string numero)
    {
        if (string.IsNullOrWhiteSpace(numero))
        {
            return null;
        }

        var registros = _registroRepository.Listar(numeroLote: numero)
            .OrderBy(registro => registro.DataHora)
            .ThenBy(registro => registro.CriadoEm)
            .ToArray();

        return registros.Length == 0
            ? null
            : new LoteHistorico(registros[0].NumeroLote, registros);
    }
}
