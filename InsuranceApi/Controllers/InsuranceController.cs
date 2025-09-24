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
    public async Task<ActionResult<InsuranceQuoteDto>> GetQuote([FromBody] CreateInsuranceQuoteDto createDto)
    {
        var quote = await _insuranceService.GetQuoteAsync(createDto);
        return Ok(quote);
    }

    // Create insurance policy
    [HttpPost]
    public async Task<ActionResult<InsurancePolicyDto>> CreatePolicy([FromBody] CreateInsurancePolicyDto createDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        var policy = await _insuranceService.CreatePolicyAsync(createDto, userId);
        return CreatedAtAction(nameof(CreatePolicy), policy);
    }

    // Get all policies for the authenticated client
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InsurancePolicyDto>>> GetMyPolicies()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        var policies = await _insuranceService.GetPoliciesForUserAsync(userId);
        return Ok(policies);
    }
}