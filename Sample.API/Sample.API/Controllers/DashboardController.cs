using Sample.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sample.API.Controllers
{
    [Authorize]
    [RoutePrefix("api/dashboard")]
    public class DashboardController : ApiController
    {
        [Route("getData")]
        public HttpResponseMessage Get(HttpRequestMessage request)
        {
            
            HttpResponseMessage response = null;

            DashboardViewModel totalCounts = new DashboardViewModel();

            var context = new SampleDbContext();

            totalCounts.TotalNoOfUsers = context.Users.Count();

            response = request.CreateResponse(HttpStatusCode.OK,  totalCounts);
             
            return response;
        }
    }
}
