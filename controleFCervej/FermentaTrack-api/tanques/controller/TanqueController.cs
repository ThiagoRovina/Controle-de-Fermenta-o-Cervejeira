using ControleFCervej.RESTAPI.tanques.model;
using ControleFCervej.RESTAPI.tanques.service;
using Microsoft.AspNetCore.Mvc;

namespace ControleFCervej.RESTAPI.tanques.controller;

[ApiController]
[Route("api/tanques")]
public sealed class TanqueController : ControllerBase
{
    private readonly TanqueService _tanqueService;

    public TanqueController(TanqueService tanqueService)
    {
        _tanqueService = tanqueService;
    }

    [HttpGet]
    public ActionResult<IReadOnlyCollection<Tanque>> Listar()
    {
        return Ok(_tanqueService.Listar());
    }

    [HttpGet("{id:guid}")]
    public ActionResult<Tanque> ObterPorId(Guid id)
    {
        var tanque = _tanqueService.ObterPorId(id);

        return tanque is null
            ? NotFound(new { mensagem = "Tanque nao encontrado." })
            : Ok(tanque);
    }

    [HttpPost]
    public ActionResult<Tanque> Criar(CriarTanqueRequest request)
    {
        var resultado = _tanqueService.Criar(request);

        if (resultado.Erros.Count > 0)
        {
            return BadRequest(new { erros = resultado.Erros });
        }

        return Created($"/api/tanques/{resultado.Tanque!.Id}", resultado.Tanque);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<Tanque> Atualizar(Guid id, AtualizarTanqueRequest request)
    {
        var resultado = _tanqueService.Atualizar(id, request);

        if (resultado.Erros.Count > 0)
        {
            return BadRequest(new { erros = resultado.Erros });
        }

        if (!resultado.Encontrado)
        {
            return NotFound(new { mensagem = "Tanque nao encontrado." });
        }

        return Ok(resultado.Tanque);
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Remover(Guid id)
    {
        return _tanqueService.Remover(id)
            ? NoContent()
            : NotFound(new { mensagem = "Tanque nao encontrado." });
    }
}
