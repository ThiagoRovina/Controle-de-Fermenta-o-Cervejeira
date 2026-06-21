using ControleFCervej.RESTAPI.cervejas.repository;
using ControleFCervej.RESTAPI.parametros.model;
using ControleFCervej.RESTAPI.parametros.repository;

namespace ControleFCervej.RESTAPI.parametros.service;

public sealed class ParametrosService
{
    private readonly CervejaRepository _cervejaRepository;
    private readonly ParametrosRepository _parametrosRepository;

    public ParametrosService(
        CervejaRepository cervejaRepository,
        ParametrosRepository parametrosRepository
    )
    {
        _cervejaRepository = cervejaRepository;
        _parametrosRepository = parametrosRepository;
    }

    public ResultadoParametros ObterPorCervejaId(Guid cervejaId)
    {
        if (_cervejaRepository.ObterPorId(cervejaId) is null)
        {
            return ResultadoParametros.NaoEncontrado("Cerveja nao encontrada.");
        }

        var parametros = _parametrosRepository.ObterPorCervejaId(cervejaId);

        return parametros is null
            ? ResultadoParametros.NaoEncontrado("Parametros nao encontrados para esta cerveja.")
            : ResultadoParametros.ComSucesso(parametros);
    }

    public ResultadoParametros Salvar(Guid cervejaId, AtualizarParametrosRequest request)
    {
        if (_cervejaRepository.ObterPorId(cervejaId) is null)
        {
            return ResultadoParametros.NaoEncontrado("Cerveja nao encontrada.");
        }

        var erros = Validar(request);

        if (erros.Count > 0)
        {
            return ResultadoParametros.ComErros(erros);
        }

        var parametros = _parametrosRepository.Salvar(
            cervejaId,
            request.TempMin!.Value,
            request.TempMax!.Value,
            request.PhMin!.Value,
            request.PhMax!.Value,
            request.ExtratoMin!.Value,
            request.ExtratoMax!.Value
        );

        return ResultadoParametros.ComSucesso(parametros);
    }

    private static Dictionary<string, string[]> Validar(AtualizarParametrosRequest request)
    {
        var erros = new Dictionary<string, string[]>();

        ValidarFaixa(erros, "temp", request.TempMin, request.TempMax, "Temperatura");
        ValidarFaixa(erros, "ph", request.PhMin, request.PhMax, "pH");
        ValidarFaixa(erros, "extrato", request.ExtratoMin, request.ExtratoMax, "Extrato");

        if (request.PhMin is < 0 or > 14)
        {
            erros["phMin"] = ["pH minimo deve estar entre 0 e 14."];
        }

        if (request.PhMax is < 0 or > 14)
        {
            erros["phMax"] = ["pH maximo deve estar entre 0 e 14."];
        }

        return erros;
    }

    private static void ValidarFaixa(
        Dictionary<string, string[]> erros,
        string chave,
        decimal? minimo,
        decimal? maximo,
        string nome
    )
    {
        if (minimo is null)
        {
            erros[$"{chave}Min"] = [$"{nome} minimo e obrigatorio."];
        }

        if (maximo is null)
        {
            erros[$"{chave}Max"] = [$"{nome} maximo e obrigatorio."];
        }

        if (minimo is not null && maximo is not null && minimo > maximo)
        {
            erros[chave] = [$"{nome} minimo nao pode ser maior que o maximo."];
        }
    }
}

public sealed record ResultadoParametros(
    ParametrosAceitaveis? Parametros,
    Dictionary<string, string[]> Erros,
    bool Encontrado,
    string? Mensagem
)
{
    public static ResultadoParametros ComSucesso(ParametrosAceitaveis parametros)
    {
        return new ResultadoParametros(parametros, [], true, null);
    }

    public static ResultadoParametros ComErros(Dictionary<string, string[]> erros)
    {
        return new ResultadoParametros(null, erros, true, null);
    }

    public static ResultadoParametros NaoEncontrado(string mensagem)
    {
        return new ResultadoParametros(null, [], false, mensagem);
    }
}
