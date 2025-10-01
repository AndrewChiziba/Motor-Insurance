using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InsuranceApi.DTOs;
using InsuranceApi.Interfaces;
using System.Security.Claims;

namespace InsuranceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize(Policy = "Client")] // Only clients can access
public class InsuranceController : ControllerBase
{
    private readonly IInsuranceService _insuranceService;

    public InsuranceController(IInsuranceService insuranceService)
    {
        _insuranceService = insuranceService;
    }

    // Get insurance quote
    [HttpPost("quote")]
    public async Task<ActionResult<InsuranceQuoteResponseDto>> GetQuote([FromBody] CreateInsuranceQuoteDto createDto)
    {
        var quote = await _insuranceService.GetQuoteAsync(createDto);
        return Ok(quote);
    }

    //Check for active insurance policy
    [HttpGet("active/{vehicleId}")]
    public async Task<ActionResult<ActivePolicyResponseDto>> CheckActivePolicy(Guid vehicleId)
    {
        var result = await _insuranceService.GetActivePolicyAsync(vehicleId);
        return Ok(result);
    }


    // Create insurance policy
    [HttpPost]
    public async Task<ActionResult<InsurancePolicyDto>> CreatePolicy([FromBody] CreateInsurancePolicyDto createDto)
    {
        // Get userid from claims
        var userId = User.FindFirst("UserId")?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        var policy = await _insuranceService.CreatePolicyAsync(createDto, userId);
        return CreatedAtAction(nameof(CreatePolicy), policy);
    }

    // Get all policies for the authenticated client
    [HttpGet("client-policies")]
    public async Task<ActionResult<IEnumerable<ClientPolicyDto>>> GetClientPolicies()
    {
        var userId = User.FindFirst("UserId")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        var policies = await _insuranceService.GetClientPoliciesAsync(userId);
        return Ok(policies);
    }
}