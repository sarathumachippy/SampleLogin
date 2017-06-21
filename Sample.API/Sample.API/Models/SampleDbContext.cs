using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Sample.API.Models
{
    public class SampleDbContext: DbContext
    {
        public SampleDbContext()
            : base("Conn")
        {
        }

        public DbSet<User> Users { get; set; }
            

    }
}