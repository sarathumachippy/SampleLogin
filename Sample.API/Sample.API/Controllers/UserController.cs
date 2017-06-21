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
    [RoutePrefix("api/users")]
    public class UserController : ApiController
    {
        [HttpGet]
        [Route("search/{page:int=0}/{pageSize=4}/{filter?}")]
        public HttpResponseMessage Search(HttpRequestMessage request, int? page, int? pageSize, string filter = null)
        {
            int currentPage = page.Value;
            int currentPageSize = pageSize.Value;

            
            HttpResponseMessage response = null;
            List<User> users = null;
            int totalUsers = new int();
            var context = new SampleDbContext();

            if (!string.IsNullOrEmpty(filter))
            {
                filter = filter.Trim().ToLower();

            
            users = context.Users.Where(c => c.Username.ToLower().Contains(filter) ||
                                                c.Email.ToLower().Contains(filter))
                    .OrderBy(c => c.ID)
                    .Skip(currentPage * currentPageSize)
                    .Take(currentPageSize)
                    .ToList();

                    totalUsers = context.Users
                        .Where(c => c.Username.ToLower().Contains(filter) ||
                               c.Email.ToLower().Contains(filter))
                        .Count();
                }
                else
                {
                    users = context.Users
                        .OrderBy(c => c.ID)
                        .Skip(currentPage * currentPageSize)
                        .Take(currentPageSize)
                    .ToList();

                    totalUsers = context.Users.Count();
                }

            PaginationSet<User> pagedSet = new PaginationSet<User>()
            {
                Page = currentPage,
                TotalCount = totalUsers,
                TotalPages = (int)Math.Ceiling((decimal)totalUsers / currentPageSize),
                Items = users
            };

            response = request.CreateResponse(HttpStatusCode.OK, pagedSet);

            return response;
        }

        [Route("getSingle/{id:int}")]
        public HttpResponseMessage Get(HttpRequestMessage request, int id)
        {
           
            HttpResponseMessage response = null;
            var context = new SampleDbContext();
            var user = context.Users.FirstOrDefault(u => u.ID == id);

            response = request.CreateResponse(HttpStatusCode.OK, user);
            return response;
        }

        [HttpPost]
        [Route("update")]
        public HttpResponseMessage Update(HttpRequestMessage request, User user)
        {
            
            HttpResponseMessage response = null;
            var context = new SampleDbContext();
            if (!ModelState.IsValid)
            {
                response = request.CreateResponse(HttpStatusCode.BadRequest,
                    ModelState.Keys.SelectMany(k => ModelState[k].Errors)
                            .Select(m => m.ErrorMessage).ToArray());
            }
            else
            {
                User _user = context.Users.FirstOrDefault(u => u.ID == user.ID);
                _user.Fullname = user.Fullname;
                _user.Email = user.Email;
                _user.Mobile = user.Mobile;
                context.SaveChanges();
                response = request.CreateResponse(HttpStatusCode.OK);
            }

            return response;
        }
    }
}
