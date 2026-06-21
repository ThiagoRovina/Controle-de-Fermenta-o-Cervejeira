using ControleFCervej.RESTAPI.cervejas.repository;
using ControleFCervej.RESTAPI.parametros.model;
using ControleFCervej.RESTAPI.parametros.repository;
using ControleFCervej.RESTAPI.registros.model;
using ControleFCervej.RESTAPI.registros.repository;
using ControleFCervej.RESTAPI.tanques.repository;

namespace ControleFCervej.RESTAPI.registros.service;

public sealed class RegistroService
{
    private readonly CervejaRepository _cervejaRepository;
    private readonly TanqueRepository _tanqueRepository;
    private readonly ParametrosRepository _parametrosRepository;
    private readonly RegistroRepository _registroRepository;

    public RegistroService(
        CervejaRepository cervejaRepository,
        TanqueRepository tanqueRepository,
        ParametrosRepository parametrosRepository,
        RegistroRepository registroRepository
    )
    {
        _cervejaRepository = cervejaRepository;
        _tanqueRepository = tanqueRepository;
        _parametrosRepository = parametrosRepository;
        _registroRepository = registroRepository;
    }

    public IReadOnlyCollection<RegistroFermentativo> Listar(
        Guid? cervejaId = null,
        Guid? tanqueId = null,
        string? numeroLote = null,
        string? status = null
    )
    {
        return _registroRepository.Listar(cervejaId, tanqueId, numeroLote, status);
    }

    public RegistroFermentativo? ObterPorId(Guid id)
    {
        return _registroRepository.ObterPorId(id);
    }

    public ResultadoRegistro Criar(CriarRegistroRequest request)
    {
        var erros = Validar(request);

        if (erros.Count > 0)
        {
            return ResultadoRegistro.ComErros(erros);
        }

        var cervejaId = request.CervejaId!.Value;
        var tanqueId = request.TanqueId!.Value;

        if (_cervejaRepository.ObterPorId(cervejaId) is null)
        {
            return ResultadoRegistro.NaoEncontrado("Cerveja nao encontrada.");
        }

        if (_tanqueRepository.ObterPorId(tanqueId) is null)
        {
            return ResultadoRegistro.NaoEncontrado("Tanque nao encontrado.");
        }

        var parametros = _parametrosRepository.ObterPorCervejaId(cervejaId);

        if (parametros is null)
        {
            return ResultadoRegistro.ComErros(new Dictionary<string, string[]>
            {
                ["parametros"] = ["Parametros aceitaveis nao definidos para esta cerveja."]
            });
        }

        var status = ClassificarRegistro(
            request.Temperatura!.Value,
            request.Ph!.Value,
            request.Extrato!.Value,
            parametros
        );

        var registro = _registroRepository.Criar(
            cervejaId,
            tanqueId,
            request.NumeroLote!.Trim(),
            request.DataHora!.Value,
            request.Temperatura!.Value,
            request.Ph!.Value,
            request.Extrato!.Value,
            string.IsNullOrWhiteSpace(request.Observacoes) ? null : request.Observacoes.Trim(),
            status
        );

        return ResultadoRegistro.ComSucesso(registro);
    }

    public ResultadoRegistro Atualizar(Guid id, AtualizarRegistroRequest request)
    {
        var erros = Validar(request);

        if (erros.Count > 0)
        {
            return ResultadoRegistro.ComErros(erros);
        }

        if (_registroRepository.ObterPorId(id) is null)
        {
            return ResultadoRegistro.NaoEncontrado("Registro nao encontrado.");
        }

        var cervejaId = request.CervejaId!.Value;
        var tanqueId = request.TanqueId!.Value;

        if (_cervejaRepository.ObterPorId(cervejaId) is null)
        {
            return ResultadoRegistro.NaoEncontrado("Cerveja nao encontrada.");
        }

        if (_tanqueRepository.ObterPorId(tanqueId) is null)
        {
            return ResultadoRegistro.NaoEncontrado("Tanque nao encontrado.");
        }

        var parametros = _parametrosRepository.ObterPorCervejaId(cervejaId);

        if (parametros is null)
        {
            return ResultadoRegistro.ComErros(new Dictionary<string, string[]>
            {
                ["parametros"] = ["Parametros aceitaveis nao definidos para esta cerveja."]
            });
        }

        var status = ClassificarRegistro(
            request.Temperatura!.Value,
            request.Ph!.Value,
            request.Extrato!.Value,
            parametros
        );

        var registro = _registroRepository.Atualizar(
            id,
            cervejaId,
            tanqueId,
            request.NumeroLote!.Trim(),
            request.DataHora!.Value,
            request.Temperatura!.Value,
            request.Ph!.Value,
            request.Extrato!.Value,
            string.IsNullOrWhiteSpace(request.Observacoes) ? null : request.Observacoes.Trim(),
            status
        );

        return registro is null
            ? ResultadoRegistro.NaoEncontrado("Registro nao encontrado.")
            : ResultadoRegistro.ComSucesso(registro);
    }

    public bool Remover(Guid id)
    {
        return _registroRepository.Remover(id);
    }

    private static Dictionary<string, string[]> Validar(AtualizarRegistroRequest request)
    {
        return Validar(new CriarRegistroRequest(
            request.CervejaId,
            request.TanqueId,
            request.NumeroLote,
            request.DataHora,
            request.Temperatura,
            request.Ph,
            request.Extrato,
            request.Observacoes
        ));
    }

    private static Dictionary<string, string[]> Validar(CriarRegistroRequest request)
    {
        var erros = new Dictionary<string, string[]>();

        if (request.CervejaId is null || request.CervejaId == Guid.Empty)
        {
            erros["cervejaId"] = ["Cerveja e obrigatoria."];
        }

        if (request.TanqueId is null || request.TanqueId == Guid.Empty)
        {
            erros["tanqueId"] = ["Tanque e obrigatorio."];
        }

        if (string.IsNullOrWhiteSpace(request.NumeroLote))
        {
            erros["numeroLote"] = ["Numero do lote e obrigatorio."];
        }
        else if (request.NumeroLote.Trim().Length > 50)
        {
            erros["numeroLote"] = ["Numero do lote deve ter no maximo 50 caracteres."];
        }

        if (request.DataHora is null)
        {
            erros["dataHora"] = ["Data e hora sao obrigatorias."];
        }

        ValidarDecimalObrigatorio(erros, "temperatura", request.Temperatura, "Temperatura");
        ValidarDecimalObrigatorio(erros, "ph", request.Ph, "pH");
        ValidarDecimalObrigatorio(erros, "extrato", request.Extrato, "Extrato");

        if (request.Ph is < 0 or > 14)
        {
            erros["ph"] = ["pH deve estar entre 0 e 14."];
        }

        if (request.Observacoes is not null && request.Observacoes.Length > 500)
        {
            erros["observacoes"] = ["Observacoes devem ter no maximo 500 caracteres."];
        }

        return erros;
    }

    private static void ValidarDecimalObrigatorio(
        Dictionary<string, string[]> erros,
        string chave,
        decimal? valor,
        string nome
    )
    {
        if (valor is null)
        {
            erros[chave] = [$"{nome} e obrigatorio."];
        }
    }

    private static string ClassificarRegistro(
        decimal temperatura,
        decimal ph,
        decimal extrato,
        ParametrosAceitaveis parametros
    )
    {
        var scores = new[]
        {
            ClassificarParametro(temperatura, parametros.TempMin, parametros.TempMax, 2m),
            ClassificarParametro(ph, parametros.PhMin, parametros.PhMax, 0.3m),
            ClassificarParametro(extrato, parametros.ExtratoMin, parametros.ExtratoMax, 1.5m)
        };

        var pior = scores.Max();

        return pior switch
        {
            0 => StatusFermentacao.DentroPadrao,
            1 => StatusFermentacao.Atencao,
            _ => StatusFermentacao.ForaPadrao
        };
    }

    private static int ClassificarParametro(decimal valor, decimal minimo, decimal maximo, decimal tolerancia)
    {
        if (valor >= minimo && valor <= maximo)
        {
            return 0;
        }

        var desvio = Math.Max(valor - maximo, minimo - valor);

        return desvio <= tolerancia ? 1 : 2;
    }
}

public sealed record ResultadoRegistro(
    RegistroFermentativo? Registro,
    Dictionary<string, string[]> Erros,
    bool Encontrado,
    string? Mensagem
)
{
    public static ResultadoRegistro ComSucesso(RegistroFermentativo registro)
    {
        return new ResultadoRegistro(registro, [], true, null);
    }

    public static ResultadoRegistro ComErros(Dictionary<string, string[]> erros)
    {
        return new ResultadoRegistro(null, erros, true, null);
    }

    public static ResultadoRegistro NaoEncontrado(string mensagem)
    {
        return new ResultadoRegistro(null, [], false, mensagem);
    }
}
