using Sample.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sample.API.Services
{
    public interface IMembershipService
    {
        MembershipContext ValidateUser(string username, string password);
        //User CreateUser(string username, string fullname, string email, string password, string mobile, int[] roles);
        //bool ChangePwd(string username, string password1, string password2);
        //User GetUser(int userId);
        List<Role> GetUserRoles(string username);
    }
}
