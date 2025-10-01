using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InsuranceApi.DTOs;
using InsuranceApi.Interfaces;
using System.Security.Claims;

namespace InsuranceApi.Controllers;


[ApiController]
[Route("api/[controller]")]
// [Authorize(Policy = "Client")] // Only clients can access
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    // Process payment and update policy
    [HttpPost]
    public async Task<ActionResult<PaymentDto>> ProcessPayment([FromBody] CreatePaymentDto createDto)
    {
        var userId = User.FindFirst("UserId")?.Value;
        var payment = await _paymentService.ProcessPaymentAsync(createDto, userId);
        return Ok(payment);
    }
}