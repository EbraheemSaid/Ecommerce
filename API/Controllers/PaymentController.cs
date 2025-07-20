using Core.Entities;
using Core.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class PaymentsController(IPaymentService paymentService,
        IGenericRepository<DeliveryMethod> deliveryMethodRepo) : BaseApiController
    {
        [Authorize]
        [HttpPost("{cartId}")]
        public async Task<ActionResult<Cart>> CreateOrUpdatePaymentIntent(string cartId)
        {
            var cart = await paymentService.CreateOrUpdatePaymentIntent(cartId);

            if (cart == null) return BadRequest();

            return Ok(cart);

        }

        [HttpGet("delivery-methods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            var deliveryMethods = await deliveryMethodRepo.GetAllAsync();
            return Ok(deliveryMethods);
        }
    }
}
