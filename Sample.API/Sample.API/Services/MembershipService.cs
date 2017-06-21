using Sample.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace Sample.API.Services
{
    public class MembershipService: IMembershipService
    {
        public MembershipContext ValidateUser(string username, string password)
        {
            var membershipCtx = new MembershipContext();
            var context = new SampleDbContext();

            var user = context.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
            if (user != null)
            {
                var userRoles = GetUserRoles(user.Username);
                membershipCtx.User = user;

                var identity = new GenericIdentity(user.Username);
                membershipCtx.Principal = new GenericPrincipal(
                    identity,
                    userRoles.Select(x => x.Name).ToArray());
            }

            return membershipCtx;
        }

        public List<Role> GetUserRoles(string username)
        {
            List<Role> _result = new List<Role>();

            var role = new Role();
            role.ID = 1;
            role.Name = "Admin";

            _result.Add(role);
           
            return _result.Distinct().ToList();
        }
    }
}