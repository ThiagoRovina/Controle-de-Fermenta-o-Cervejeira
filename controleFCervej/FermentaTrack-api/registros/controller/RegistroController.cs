using ControleFCervej.RESTAPI.registros.model;
using ControleFCervej.RESTAPI.registros.service;
using Microsoft.AspNetCore.Mvc;

namespace ControleFCervej.RESTAPI.registros.controller;

[ApiController]
[Route("api/registros")]
public sealed class RegistroController : ControllerBase
{
    private readonly RegistroService _registroService;

    public RegistroController(RegistroService registroService)
    {
        _registroService = registroService;
    }

    [HttpGet]
    public ActionResult<IReadOnlyCollection<RegistroFermentativo>> Listar(
        [FromQuery] Guid? cervejaId,
        [FromQuery] Guid? tanqueId,
        [FromQuery] string? numeroLote,
        [FromQuery] string? status
    )
    {
        return Ok(_registroService.Listar(cervejaId, tanqueId, numeroLote, status));
    }

    [HttpGet("{id:guid}")]
    public ActionResult<RegistroFermentativo> ObterPorId(Guid id)
    {
        var registro = _registroService.ObterPorId(id);

        return registro is null
            ? NotFound(new { mensagem = "Registro nao encontrado." })
            : Ok(registro);
    }

    [HttpPost]
    public ActionResult<RegistroFermentativo> Criar(CriarRegistroRequest request)
    {
        var resultado = _registroService.Criar(request);

        if (resultado.Erros.Count > 0)
        {
            return BadRequest(new { erros = resultado.Erros });
        }

        if (!resultado.Encontrado)
        {
            return NotFound(new { mensagem = resultado.Mensagem });
        }

        return Created($"/api/registros/{resultado.Registro!.Id}", resultado.Registro);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<RegistroFermentativo> Atualizar(Guid id, AtualizarRegistroRequest request)
    {
        var resultado = _registroService.Atualizar(id, request);

        if (resultado.Erros.Count > 0)
        {
            return BadRequest(new { erros = resultado.Erros });
        }

        if (!resultado.Encontrado)
        {
            return NotFound(new { mensagem = resultado.Mensagem });
        }

        return Ok(resultado.Registro);
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Remover(Guid id)
    {
        return _registroService.Remover(id)
            ? NoContent()
            : NotFound(new { mensagem = "Registro nao encontrado." });
    }
}
