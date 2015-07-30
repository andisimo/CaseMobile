using CrmEarlyBound;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Web.Http;

namespace WebRole1.Controllers
{
    [DataContract]
    public class TestCarePlanObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public string Name
        {
            get;
            set;
        }

        [DataMember]
        public string Description
        {
            get;
            set;
        }
    }
    public class CarePlansController : ApiController
    {
        // GET api/careplans
        public HttpResponseMessage Get(Guid relatedId)
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from c in ctx.new_careplanSet
                        where c.new_ChildId.Id == relatedId
                        select new CrmEarlyBound.new_careplan
                        {
                            Id = c.Id,
                            new_name = c.new_name,
                            new_Description = c.new_Description
                        };

            var queryResults = query.ToList();

            var listReturn = new List<TestCarePlanObject>();
            foreach (new_careplan x in queryResults)
            {
                var returnObject = new TestCarePlanObject();
                returnObject.Id = x.Id;
                returnObject.Name = x.new_name;
                returnObject.Description = x.new_Description;

                listReturn.Add(returnObject);
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                listReturn);
        }
    }
}
