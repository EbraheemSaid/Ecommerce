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
    public class GenericRepository<T>(StoreContext context) : IGenericRepository<T> where T : BaseEntity
    {
        // Implementation of the methods defined in IGenericRepository<T>
        public async Task<T?> GetByIdAsync(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }
        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await context.Set<T>().ToListAsync();
        }
        public void Add(T entity)
        {
            context.Set<T>().Add(entity);
        }
        public void Update(T entity)
        {
            context.Set<T>().Attach(entity);
            context.Entry(entity).State = EntityState.Modified; // Ensure the entity is marked as modified

        }
        public void Remove(T entity)
        {
            context.Set<T>().Remove(entity);
        }
        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0; // Save changes asynchronously
        }
        public bool Exists(int id)
        {
            return context.Set<T>().Any(e => e.Id == id); // Check if an entity with the given ID exists
        }

        public async Task<T?> GetEntityWithSpec(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).FirstOrDefaultAsync(); // Use FirstOrDefaultAsync to get a single entity with the specification
        }

        public async Task<IReadOnlyList<T>> ListAsyncWithSpec(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).ToListAsync();
        }



        public async Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec)
        {
            return await ApplySpecification(spec).FirstOrDefaultAsync(); // Use FirstOrDefaultAsync to get a single entity with the specification
        }

        public async Task<IReadOnlyList<TResult>> ListAsyncWithSpec<TResult>(ISpecification<T, TResult> spec)
        {
            return await ApplySpecification(spec).ToListAsync(); // Use ToListAsync to get a list of entities with the specification
        }

        private IQueryable<T> ApplySpecification(ISpecification<T> spec)
        {
            return SpecificationEvaluator<T>.GetQuery(context.Set<T>().AsQueryable(), spec);
        }
        private IQueryable<TResult> ApplySpecification<TResult>(ISpecification<T, TResult> spec)
        {
            return SpecificationEvaluator<T>.GetQuery<T, TResult>(context.Set<T>().AsQueryable(), spec);

        }

        public async Task<int> CountAsync(ISpecification<T> spec)
        {
            var query = context.Set<T>().AsQueryable();
            query = spec.ApplyCriteria(query); // Apply the specification criteria to the query
            return await query.CountAsync(); // Count the number of entities matching the specification
        }
    }
}
