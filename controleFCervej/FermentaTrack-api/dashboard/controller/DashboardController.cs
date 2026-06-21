using ControleFCervej.RESTAPI.dashboard.model;
using ControleFCervej.RESTAPI.dashboard.service;
using Microsoft.AspNetCore.Mvc;

namespace ControleFCervej.RESTAPI.dashboard.controller;

[ApiController]
[Route("api/dashboard")]
public sealed class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public ActionResult<DashboardIndicadores> ObterIndicadores()
    {
        return Ok(_dashboardService.ObterIndicadores());
    }
}
