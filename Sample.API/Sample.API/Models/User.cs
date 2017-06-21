using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sample.API.Models
{
    public class User
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsLocked { get; set; }
        public DateTime DateCreated { get; set; }
        public string Mobile { get; set; }
        public string Fullname { get; set; }
        public bool IsActive { get; set; }
        public bool IsAdmin { get; set; }
        public string Image { get; set; }

    }

    public static class UserFunctions
    {
        public static User ValidateUser(UserViewModel  user)
        {
            var context = new SampleDbContext();
            var ret = context.Users.FirstOrDefault(u => u.Username == user.Username && u.Password == user.Password);
            if (ret == null)
            {
                return null;
            }
            return ret;
        }
    }
}