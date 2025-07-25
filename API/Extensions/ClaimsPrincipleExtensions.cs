﻿using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using System.Security.Authentication;
using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static async Task<AppUser> GetUserByEmail(this UserManager<AppUser> userManager,
            ClaimsPrincipal claims)
        {
            var user = await userManager.Users.FirstOrDefaultAsync(x => x.Email == claims.GetEmail());

            if (user == null) throw new AuthenticationException("User not found");

            return user;

        }
        public static string GetEmail(this ClaimsPrincipal claims)
        {
            var email = claims.FindFirstValue(ClaimTypes.Email);
            return email ?? throw new AuthenticationException("Email not found");
        }
    
        public static async Task<AppUser> GetUserByEmailWithAddress(this UserManager<AppUser> userManager,
            ClaimsPrincipal claims)
        {
            var user = await userManager.Users.Include(x => x.Address).FirstOrDefaultAsync(x => x.Email == claims.GetEmail());

            if (user == null) throw new AuthenticationException("User not found");

            return user;

        }
    }
}
