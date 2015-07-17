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
    public class TestAllergyObject
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

    public class AllergiesController : ApiController
    {
        // GET api/allergies
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse("Url=https://childsafety.crm.dynamics.com; Username=; Password=");
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from a in ctx.new_allergySet
                        select new CrmEarlyBound.new_allergy
                        {
                            Id = a.Id,
                            new_name = a.new_name,
                            new_Description = a.new_Description,
                        };

            var queryResults = query.ToList();

            var listReturn = new List<TestAllergyObject>();
            foreach (new_allergy x in queryResults)
            {
                var returnObject = new TestAllergyObject();
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
