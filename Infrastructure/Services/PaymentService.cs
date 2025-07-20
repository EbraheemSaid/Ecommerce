using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class PaymentService(
        IConfiguration config,
        ICartService cartService,
        IGenericRepository<Core.Entities.Product> productRepo,
        IGenericRepository<DeliveryMethod> deliveryMethodRepo) : IPaymentService
    {
        public async Task<Cart?> CreateOrUpdatePaymentIntent(string cartId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var cart = await cartService.GetCartAsync(cartId);

            if (cart == null) return null;

            var shippingPrice = 0m;

            if (cart.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await deliveryMethodRepo.GetByIdAsync((int)cart.DeliveryMethodId);
                if (deliveryMethod == null) return null;
                shippingPrice = deliveryMethod.Price;
            }

            foreach (var item in cart.Items)
            {
                var productItem = await productRepo.GetByIdAsync(item.ProductId);
                if (productItem == null) return null;

                if (item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            var paymentIntentService = new PaymentIntentService();
            PaymentIntent? intent = null;

            if (string.IsNullOrEmpty(cart.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)(shippingPrice * 100),
                    Currency = "usd",
                    PaymentMethodTypes = ["card"]
                };
                intent = await paymentIntentService.CreateAsync(options);
                cart.ClientSecret = intent.ClientSecret;
                cart.PaymentIntentId = intent.Id;

            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)(shippingPrice * 100)
                };
                intent = await paymentIntentService.UpdateAsync(cart.PaymentIntentId, options);
            }

            await cartService.AddCartAsync(cart);

            return cart;
        }
    }
}
