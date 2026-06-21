using ControleFCervej.RESTAPI.tanques.model;
using ControleFCervej.RESTAPI.tanques.repository;

namespace ControleFCervej.RESTAPI.tanques.service;

public sealed class TanqueService
{
    private readonly TanqueRepository _tanqueRepository;

    public TanqueService(TanqueRepository tanqueRepository)
    {
        _tanqueRepository = tanqueRepository;
    }

    public IReadOnlyCollection<Tanque> Listar()
    {
        return _tanqueRepository.Listar();
    }

    public Tanque? ObterPorId(Guid id)
    {
        return _tanqueRepository.ObterPorId(id);
    }

    public ResultadoTanque Criar(CriarTanqueRequest request)
    {
        var erros = Validar(request.Nome, request.Capacidade);

        if (erros.Count > 0)
        {
            return ResultadoTanque.ComErros(erros);
        }

        var tanque = _tanqueRepository.Criar(request.Nome!.Trim(), request.Capacidade!.Value);

        return ResultadoTanque.ComSucesso(tanque);
    }

    public ResultadoTanque Atualizar(Guid id, AtualizarTanqueRequest request)
    {
        var erros = Validar(request.Nome, request.Capacidade);

        if (erros.Count > 0)
        {
            return ResultadoTanque.ComErros(erros);
        }

        var tanqueAtualizado = _tanqueRepository.Atualizar(
            id,
            request.Nome!.Trim(),
            request.Capacidade!.Value
        );

        if (tanqueAtualizado is null)
        {
            return ResultadoTanque.NaoEncontrado();
        }

        return ResultadoTanque.ComSucesso(tanqueAtualizado);
    }

    public bool Remover(Guid id)
    {
        return _tanqueRepository.Remover(id);
    }

    private static Dictionary<string, string[]> Validar(string? nome, decimal? capacidadeL)
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

        if (capacidadeL is null)
        {
            erros["capacidadeL"] = ["Capacidade e obrigatoria."];
        }
        else if (capacidadeL <= 0)
        {
            erros["capacidadeL"] = ["Capacidade deve ser maior que zero."];
        }

        return erros;
    }
}

public sealed record ResultadoTanque(
    Tanque? Tanque,
    Dictionary<string, string[]> Erros,
    bool Encontrado
)
{
    public static ResultadoTanque ComSucesso(Tanque tanque)
    {
        return new ResultadoTanque(tanque, [], true);
    }

    public static ResultadoTanque ComErros(Dictionary<string, string[]> erros)
    {
        return new ResultadoTanque(null, erros, true);
    }

    public static ResultadoTanque NaoEncontrado()
    {
        return new ResultadoTanque(null, [], false);
    }
}
