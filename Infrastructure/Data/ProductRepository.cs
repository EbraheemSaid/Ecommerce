﻿using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class ProductRepository(StoreContext context) : IProductRepository
    {
        public void AddProduct(Product product)
        {
            context.Products.Add(product);
        }

        public void DeleteProduct(Product product)
        {
            context.Products.Remove(product);
        }

        public async Task<IReadOnlyList<string>> GetBrandsAsync()
        {
            return await context.Products.Select(p => p.Brand).Distinct().ToListAsync();
        }
        public async Task<IReadOnlyList<string>> GetTypesAsync()
        {
            return await context.Products.Select(p => p.Type).Distinct().ToListAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await context.Products.FindAsync(id) ?? throw new KeyNotFoundException($"Product with ID {id} not found.");
        }

        public async Task<IReadOnlyList<Product>> GetProductsAsync(string? brand, string? type, string? sort)
        {
            var query = context.Products.AsQueryable();
            if (!string.IsNullOrWhiteSpace(brand))
            {
                query = query.Where(p => p.Brand == brand);
            }
            if (!string.IsNullOrWhiteSpace(type))
            {
                query = query.Where(p => p.Type == type);
            }

            query = sort switch
            {
                "priceAsc" => query.OrderBy(x => x.Price),
                "priceDesc" => query.OrderByDescending(x => x.Price),
                _ => query.OrderBy(x => x.Name), // Default sorting by Name
            };

            return await query.ToListAsync();
        }



        public bool ProductExists(int id)
        {
            return context.Products.Any(p => p.Id == id);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public void UpdateProduct(Product product)
        {
            context.Entry(product).State = EntityState.Modified;
        }
    }
}
