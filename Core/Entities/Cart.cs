﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Cart
    {
        public required string Id { get; set; }
        public List<CartItem> Items { get; set; } = [];
        public int? DeliveryMethodId { get; set; }
        public string? ClientSecret { get; set; }
        public string? PaymentIntentId { get; set; }

    }
}
