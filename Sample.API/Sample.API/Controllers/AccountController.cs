using Sample.API.Models;
using Sample.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sample.API.Controllers
{
    [Authorize]
    [RoutePrefix("api/account")]
    public class AccountController : ApiController
    {
        [AllowAnonymous]
        [Route("authenticate")]
        [HttpPost]
        public HttpResponseMessage Login(HttpRequestMessage request, UserViewModel  user)
        {
                HttpResponseMessage response = null;

                if (ModelState.IsValid)
                {
                var _membershipService = new MembershipService();
                MembershipContext _userContext = _membershipService.ValidateUser(user.Username, user.Password);

                if (_userContext != null)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = true, fullname = _userContext.User.Fullname, image = _userContext.User.Image });
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                    }
                }
                else

                response = request.CreateResponse(HttpStatusCode.OK, new { success = false });

                return response;
        }

        [Route("register")]
        [HttpPost]

        public HttpResponseMessage Register(HttpRequestMessage request, User user)
        {
            HttpResponseMessage response = null;
            var context = new SampleDbContext();

            if (!ModelState.IsValid)
            {
                response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
            }
            else
            {
                var dupl = context.Users.FirstOrDefault(u => u.Username ==user.Username || u.Email == user.Email );
                if ( dupl !=null )
                {
                    ModelState.AddModelError("Invalid user", "Email or Username already exists");
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    ModelState.Keys.SelectMany(k => ModelState[k].Errors)
                            .Select(m => m.ErrorMessage).ToArray());
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                }
                else
                {
                    user.DateCreated = DateTime.Now;
                    context.Users.Add(user);
                    context.SaveChanges();
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true, ID = user.ID });
                }
            }

            return response;
            
        }
    }
}
