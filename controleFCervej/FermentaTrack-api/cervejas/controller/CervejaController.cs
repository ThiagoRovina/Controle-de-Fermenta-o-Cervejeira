using ControleFCervej.RESTAPI.cervejas.model;
using ControleFCervej.RESTAPI.cervejas.service;
using Microsoft.AspNetCore.Mvc;

namespace ControleFCervej.RESTAPI.cervejas.controller;

[ApiController]
[Route("api/cervejas")]
public sealed class CervejaController : ControllerBase
{
    private readonly CervejaService _cervejaService;

    public CervejaController(CervejaService cervejaService)
    {
        _cervejaService = cervejaService;
    }

    [HttpGet]
    public ActionResult<IReadOnlyCollection<Cerveja>> Listar()
    {
        return Ok(_cervejaService.Listar());
    }

    [HttpGet("{id:guid}")]
    public ActionResult<Cerveja> ObterPorId(Guid id)
    {
        var cerveja = _cervejaService.ObterPorId(id);

        return cerveja is null
            ? NotFound(new { mensagem = "Cerveja nao encontrada." })
            : Ok(cerveja);
    }

    [HttpPost]
    public ActionResult<Cerveja> Criar(CriarCervejaRequest request)
    {
        var resultado = _cervejaService.Criar(request);

        if (resultado.Erros.Count > 0)
        {
            return BadRequest(new { erros = resultado.Erros });
        }

        return Created($"/api/cervejas/{resultado.Cerveja!.Id}", resultado.Cerveja);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<Cerveja> Atualizar(Guid id, AtualizarCervejaRequest request)
    {
        var resultado = _cervejaService.Atualizar(id, request);

        if (resultado.Erros.Count > 0)
        {
            return BadRequest(new { erros = resultado.Erros });
        }

        if (!resultado.Encontrado)
        {
            return NotFound(new { mensagem = "Cerveja nao encontrada." });
        }

        return Ok(resultado.Cerveja);
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Remover(Guid id)
    {
        return _cervejaService.Remover(id)
            ? NoContent()
            : NotFound(new { mensagem = "Cerveja nao encontrada." });
    }
}
