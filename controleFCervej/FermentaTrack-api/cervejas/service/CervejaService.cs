using ControleFCervej.RESTAPI.cervejas.model;
using ControleFCervej.RESTAPI.cervejas.repository;

namespace ControleFCervej.RESTAPI.cervejas.service;

public sealed class CervejaService
{
    private readonly CervejaRepository _cervejaRepository;

    public CervejaService(CervejaRepository cervejaRepository)
    {
        _cervejaRepository = cervejaRepository;
    }

    public IReadOnlyCollection<Cerveja> Listar()
    {
        return _cervejaRepository.Listar();
    }

    public Cerveja? ObterPorId(Guid id)
    {
        return _cervejaRepository.ObterPorId(id);
    }

    public ResultadoCerveja Criar(CriarCervejaRequest request)
    {
        var erros = Validar(request.Nome, request.Estilo);

        if (erros.Count > 0)
        {
            return ResultadoCerveja.ComErros(erros);
        }

        var cerveja = _cervejaRepository.Criar(
            request.Nome!.Trim(),
            request.Estilo!.Trim()
        );

        return ResultadoCerveja.ComSucesso(cerveja);
    }

    public ResultadoCerveja Atualizar(Guid id, AtualizarCervejaRequest request)
    {
        var erros = Validar(request.Nome, request.Estilo);

        if (erros.Count > 0)
        {
            return ResultadoCerveja.ComErros(erros);
        }

        var cervejaAtualizada = _cervejaRepository.Atualizar(
            id,
            request.Nome!.Trim(),
            request.Estilo!.Trim()
        );

        if (cervejaAtualizada is null)
        {
            return ResultadoCerveja.NaoEncontrado();
        }

        return ResultadoCerveja.ComSucesso(cervejaAtualizada);
    }

    public bool Remover(Guid id)
    {
        return _cervejaRepository.Remover(id);
    }

    private static Dictionary<string, string[]> Validar(string? nome, string? estilo)
    {
        var erros = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(nome))
        {
            erros["nome"] = ["Nome e obrigatorio."];
        }
        else if (nome.Trim().Length > 100)
        {
            erros["nome"] = ["Nome deve ter no maximo 100 caracteres."];
        }

        if (string.IsNullOrWhiteSpace(estilo))
        {
            erros["estilo"] = ["Estilo e obrigatorio."];
        }
        else if (estilo.Trim().Length > 100)
        {
            erros["estilo"] = ["Estilo deve ter no maximo 100 caracteres."];
        }

        return erros;
    }
}

public sealed record ResultadoCerveja(
    Cerveja? Cerveja,
    Dictionary<string, string[]> Erros,
    bool Encontrado
)
{
    public static ResultadoCerveja ComSucesso(Cerveja cerveja)
    {
        return new ResultadoCerveja(cerveja, [], true);
    }

    public static ResultadoCerveja ComErros(Dictionary<string, string[]> erros)
    {
        return new ResultadoCerveja(null, erros, true);
    }

    public static ResultadoCerveja NaoEncontrado()
    {
        return new ResultadoCerveja(null, [], false);
    }
}
