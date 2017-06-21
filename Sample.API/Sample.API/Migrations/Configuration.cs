namespace Sample.API.Migrations
{
    using Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Sample.API.Models.SampleDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(SampleDbContext context)
        {
            var count = context.Users.Count();
            if (count > 0)
            {
                return;
            } 
            context.Users.AddOrUpdate(
                u => u.Username,
                new User { Username ="sarath",  Email ="sarathlal.mcsd@gmail.com", Password = "qwerty",
                           IsLocked=false,DateCreated =DateTime.Now,Mobile="1234567890",Fullname="Sarath Lal S",
                           IsAdmin =true 
                         } 
                );

        }
    }
}
