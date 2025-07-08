using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ICartService
    {
        Task<Cart?> GetCartAsync(string key);
        Task<Cart?> AddCartAsync(Cart cart);
        Task<bool> DeleteCartAsync(string key);
    }
}
