using ControleFCervej.RESTAPI.dashboard.model;
using ControleFCervej.RESTAPI.registros.model;
using ControleFCervej.RESTAPI.registros.repository;

namespace ControleFCervej.RESTAPI.dashboard.service;

public sealed class DashboardService
{
    private readonly RegistroRepository _registroRepository;

    public DashboardService(RegistroRepository registroRepository)
    {
        _registroRepository = registroRepository;
    }

    public DashboardIndicadores ObterIndicadores()
    {
        var registros = _registroRepository.Listar();

        return new DashboardIndicadores(
            registros.Count,
            registros.Count(registro => registro.Status == StatusFermentacao.DentroPadrao),
            registros.Count(registro => registro.Status == StatusFermentacao.Atencao),
            registros.Count(registro => registro.Status == StatusFermentacao.ForaPadrao)
        );
    }
}
