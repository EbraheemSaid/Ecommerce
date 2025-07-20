using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class CartController(ICartService cartService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<Cart>> GetCartById(string id)
        {
            var cart = await cartService.GetCartAsync(id);

            return Ok(cart ?? new Cart { Id = id });
        }
        [HttpPost]
        public async Task<ActionResult<Cart>> UpdateCart(Cart cart)
        {

            var created = await cartService.AddCartAsync(cart);
            if (created == null)
            {
                return BadRequest();
            }
            return created;
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteCart(string id)
        {
            var result = await cartService.DeleteCartAsync(id);
            if (!result)
            {
                return BadRequest();
            }
            return Ok();
        }
    }
}