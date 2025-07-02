using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ISpecification<T>
    {
        Expression<Func<T, bool>>? Criteria { get; }
        Expression<Func<T, object>>? OrderBy { get; }
        Expression<Func<T, object>>? OrderByDescending { get; }
        bool IsDistinct { get; } // Indicates if the results should be distinct
        bool IsPagingEnabled { get; } // Indicates if paging is enabled
        int Take { get; } // Number of records to take
        int Skip { get; } // Number of records to skip
        IQueryable<T> ApplyCriteria(IQueryable<T> query); // Method to apply the specification to a query
    }

    public interface ISpecification<T, TResult> : ISpecification<T>
    {
        Expression<Func<T, TResult>>? Select { get; } // Allows projection to a different type
    }
}
