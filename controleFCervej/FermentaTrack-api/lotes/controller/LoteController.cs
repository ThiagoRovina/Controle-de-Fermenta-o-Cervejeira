using ControleFCervej.RESTAPI.lotes.model;
using ControleFCervej.RESTAPI.lotes.service;
using Microsoft.AspNetCore.Mvc;

namespace ControleFCervej.RESTAPI.lotes.controller;

[ApiController]
[Route("api/lotes")]
public sealed class LoteController : ControllerBase
{
    private readonly LoteService _loteService;

    public LoteController(LoteService loteService)
    {
        _loteService = loteService;
    }

    [HttpGet]
    public ActionResult<IReadOnlyCollection<LoteResumo>> Listar()
    {
        return Ok(_loteService.Listar());
    }

    [HttpGet("{numero}")]
    public ActionResult<LoteHistorico> ObterHistorico(string numero)
    {
        var historico = _loteService.ObterHistorico(numero);

        return historico is null
            ? NotFound(new { mensagem = "Lote nao encontrado." })
            : Ok(historico);
    }
}
