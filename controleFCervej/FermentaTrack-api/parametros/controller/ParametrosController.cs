using ControleFCervej.RESTAPI.parametros.model;
using ControleFCervej.RESTAPI.parametros.service;
using Microsoft.AspNetCore.Mvc;

namespace ControleFCervej.RESTAPI.parametros.controller;

[ApiController]
[Route("api/cervejas/{cervejaId:guid}/parametros")]
public sealed class ParametrosController : ControllerBase
{
    private readonly ParametrosService _parametrosService;

    public ParametrosController(ParametrosService parametrosService)
    {
        _parametrosService = parametrosService;
    }

    [HttpGet]
    public ActionResult<ParametrosAceitaveis> ObterPorCervejaId(Guid cervejaId)
    {
        var resultado = _parametrosService.ObterPorCervejaId(cervejaId);

        if (!resultado.Encontrado)
        {
            return NotFound(new { mensagem = resultado.Mensagem });
        }

        return Ok(resultado.Parametros);
    }

    [HttpPut]
    public ActionResult<ParametrosAceitaveis> Salvar(Guid cervejaId, AtualizarParametrosRequest request)
    {
        var resultado = _parametrosService.Salvar(cervejaId, request);

        if (resultado.Erros.Count > 0)
        {
            return BadRequest(new { erros = resultado.Erros });
        }

        if (!resultado.Encontrado)
        {
            return NotFound(new { mensagem = resultado.Mensagem });
        }

        return Ok(resultado.Parametros);
    }
}
